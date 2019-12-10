using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data;
using Andromeda.Data.Enumerations;
using Andromeda.Data.Interfaces;
using Andromeda.Services;
using Andromeda.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Andromeda.API
{
    public class Startup
    {
        private readonly ILogger _logger;
        public Startup(ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            Configuration = configuration;
            _logger = loggerFactory.CreateLogger<Startup>();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();
                });
            });
            services.AddHttpContextAccessor();
            services.AddMvc()
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            var appsettings = Configuration.Get<Appsettings>();
            var emailSettings = appsettings.EmailConnectionSettings;
            var databaseConnectionSettings = appsettings.DatabaseConnectionSettings;

            // configure jwt authentication
            var key = Encoding.ASCII.GetBytes(appsettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            if (databaseConnectionSettings == null)
            {
                _logger.LogWarning("Database doesn't initialized yet!");
                return;
            }

            string connectionString = databaseConnectionSettings.SqlServerDatabaseConnectionString;

            services.AddScoped(provider =>
            {
                var logger = provider.GetService<ILogger<IDaoFactory>>();
                return DaoFactories.GetFactory(DataProvider.SqlServer, connectionString, logger);
            });

            services.AddScoped(provider => {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new PinnedDisciplineService(daoFactory.PinnedDisciplineDao);
            });

            services.AddScoped(provider =>
            {
                var logger = provider.GetService<ILogger<UserService>>();
                var daoFactory = provider.GetService<IDaoFactory>();
                var pinnedDisciplineService = provider.GetService<PinnedDisciplineService>();
                var httpAccessor = provider.GetService<IHttpContextAccessor>();
                return new UserService(daoFactory.UserDao, pinnedDisciplineService, appsettings, httpAccessor, logger);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new RoleInDepartmentService(daoFactory.RoleInDepartmentDao);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var roleInDepartmentService = provider.GetService<RoleInDepartmentService>();
                var logger = provider.GetService<ILogger<RoleService>>();
                return new RoleService(daoFactory.RoleDao, roleInDepartmentService, logger);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new UserRoleInDepartmentService(daoFactory.UserRoleInDepartment);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new StudentGroupService(daoFactory.StudentGroupDao);
            });

            services.AddScoped(provider => 
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new StudyDirectionService(daoFactory.StudyDirectionDao);
            });

            services.AddScoped(provider => 
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new DisciplineTitleService(daoFactory.DisciplineTitleDao);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var disciplineTitleService = provider.GetService<DisciplineTitleService>();
                var roleInDepartmentService = provider.GetService<RoleInDepartmentService>();
                var userRoleInDepartmentService = provider.GetService<UserRoleInDepartmentService>();
                var studyDirectionService = provider.GetService<StudyDirectionService>();
                var studentGroupService = provider.GetService<StudentGroupService>();
                var logger = provider.GetService<ILogger<DepartmentService>>();
                return new DepartmentService(
                    daoFactory.DepartmentDao,
                    roleInDepartmentService, 
                    userRoleInDepartmentService, 
                    disciplineTitleService,
                    studyDirectionService, 
                    studentGroupService, 
                    logger
                );
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var studentGroupService = provider.GetService<StudentGroupService>();
                return new StudyLoadService(daoFactory.StudyLoadDao, studentGroupService);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseCors();
            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
