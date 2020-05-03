using System.Text;
using Andromeda.Data;
using Andromeda.Data.Interfaces;
using Andromeda.Services;
using Andromeda.Services.GenerateLoadStrategies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Andromeda.API.Utility;
using Andromeda.Models.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Andromeda.API
{
    public class Startup
    {
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public Startup(ILoggerFactory loggerFactory, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            Configuration = configuration;
            _logger = loggerFactory.CreateLogger<Startup>();
            _webHostEnvironment = webHostEnvironment;
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
            services.AddControllers();
            services.AddHttpContextAccessor();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            var appsettings = Configuration.Get<Appsettings>();
            var emailSettings = appsettings.EmailConnectionSettings;
            var databaseConnectionSettings = appsettings.DatabaseConnectionSettings;

            // configure jwt authentication
            var key = Encoding.ASCII.GetBytes(appsettings.Secret);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

            services.AddScoped(provider =>
            {
                var logger = provider.GetService<ILogger<IDaoFactory>>();
                return DaoFactories.GetFactory(databaseConnectionSettings, logger);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new PinnedDisciplineService(daoFactory.PinnedDisciplineDao);
            });

            services.AddScoped(provider =>
            {
                var httpContextAccessor = provider.GetService<IHttpContextAccessor>();
                return new FileService(_webHostEnvironment.ContentRootPath, httpContextAccessor);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new UserGraduateDegreeService(daoFactory.UserGraduateDegreeDao);
            });

            services.AddScoped(provider =>
            {
                var logger = provider.GetService<ILogger<UserService>>();
                var daoFactory = provider.GetService<IDaoFactory>();
                var pinnedDisciplineService = provider.GetService<PinnedDisciplineService>();
                var userGraduateDegreeService = provider.GetService<UserGraduateDegreeService>();
                var httpAccessor = provider.GetService<IHttpContextAccessor>();
                return new UserService(
                    daoFactory.UserDao,
                    pinnedDisciplineService,
                    userGraduateDegreeService,
                    appsettings,
                    httpAccessor,
                    logger
                );
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
                var userService = provider.GetService<UserService>();
                var pinnedDisciplineService = provider.GetService<PinnedDisciplineService>();

                return new ByPinnedDisciplinesStrategy(userService, pinnedDisciplineService);
            });
            services.AddScoped<IGenerateStrategy>(provider => provider.GetService<ByPinnedDisciplinesStrategy>());

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var userService = provider.GetService<UserService>();
                return new UserLoadService(daoFactory.UserLoadDao, userService);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var userLoadService = provider.GetService<UserLoadService>();
                return new StudyLoadService(daoFactory.StudyLoadDao, userLoadService);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var studyLoadService = provider.GetService<StudyLoadService>();
                var disciplineTitleService = provider.GetService<DisciplineTitleService>();
                var studentGroupService = provider.GetService<StudentGroupService>();

                return new GroupDisciplineLoadService(
                    daoFactory.GroupDisciplineLoadDao,
                    studyLoadService,
                    disciplineTitleService,
                    studentGroupService
                );
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                var departmentService = provider.GetService<DepartmentService>();
                var disciplineTitleService = provider.GetService<DisciplineTitleService>();
                var studentGroupService = provider.GetService<StudentGroupService>();
                var studyDirectionService = provider.GetService<StudyDirectionService>();
                var groupDisciplineLoadService = provider.GetService<GroupDisciplineLoadService>();
                var studyLoadService = provider.GetService<StudyLoadService>();
                var fileService = provider.GetService<FileService>();
                var logger = provider.GetService<ILogger<DepartmentLoadService>>();

                return new DepartmentLoadService(
                    daoFactory.DepartmentLoadDao,
                    departmentService,
                    disciplineTitleService,
                    studentGroupService,
                    groupDisciplineLoadService,
                    studyLoadService,
                    studyDirectionService,
                    fileService,
                    provider.ComposeGenerateStrategies(),
                    logger
                );
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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
