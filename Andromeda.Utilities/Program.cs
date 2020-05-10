using System.IO;
using Andromeda.Models.Settings;
using Andromeda.Services;
using Andromeda.Utilities.Actions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using CommandLine;
using Andromeda.Data;
using Andromeda.Data.Interfaces;
using System.Collections.Generic;

namespace Andromeda.Utilities
{
    public class Program
    {
        public static int Main(string[] args)
        {

            string path = $"{Directory.GetCurrentDirectory()}/appsettings.json";
            DatabaseConnectionSettings appsettings = DatabaseConnectionSettings.InitDefaultConnectionSettings();

            if (File.Exists(path))
            {
                appsettings = JsonConvert.DeserializeObject<DatabaseConnectionSettings>(File.ReadAllText(path));
            }

            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection, appsettings);

            var services = serviceCollection.BuildServiceProvider();
            var departmentService = services.GetService<DepartmentService>();

            return Parser.Default.ParseArguments<CreateOptions, DropOptions, MigrateDownOptions, MigrateUpOptions, ResetOptions, SeedOptions, SetSettingsOptions>(args)
            .MapResult(
                (CreateOptions options) => RunCreate(services.GetService<ILogger<Create>>(), appsettings, options),
                (DropOptions options) => RunDrop(services.GetService<ILogger<Drop>>(), appsettings, options),
                (MigrateDownOptions options) => RunMigrateDown(services.GetService<ILogger<MigrateDown>>(), appsettings, options),
                (MigrateUpOptions options) => RunMigrateUp(services.GetService<ILogger<MigrateUp>>(), appsettings, options),
                (ResetOptions options) => RunReset(services.GetService<ILogger<Reset>>(), appsettings, options, departmentService),
                (SeedOptions options) => RunSeed(services.GetService<ILogger<Seed>>(), departmentService),
                (SetSettingsOptions options) => RunSettingsUpdate(services.GetService<ILogger<SettingsUpdate>>(), appsettings, options),
                errors => ShowErrors(services.GetService<ILogger<Program>>(), errors)
            );
        }

        private static void ConfigureServices(ServiceCollection services, DatabaseConnectionSettings settings)
        {
            services.AddScoped(provider =>
            {
                var logger = provider.GetService<ILogger<IDaoFactory>>();
                return DaoFactories.GetFactory(settings, logger);
            });

            services.AddScoped(provider =>
            {
                var daoFactory = provider.GetService<IDaoFactory>();
                return new RoleInDepartmentService(daoFactory.RoleInDepartmentDao);
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

                return new DepartmentService(daoFactory.DepartmentDao, roleInDepartmentService, userRoleInDepartmentService, disciplineTitleService, studyDirectionService, studentGroupService, logger);
            }).AddLogging(builder => builder.AddConsole());
        }

        static int RunCreate(ILogger logger, DatabaseConnectionSettings settings, CreateOptions options) => Create.Run(logger, settings);
        static int RunDrop(ILogger logger, DatabaseConnectionSettings settings, DropOptions options) => Drop.Run(logger, settings);
        static int RunMigrateDown(ILogger logger, DatabaseConnectionSettings settings, MigrateDownOptions options) => MigrateDown.Run(logger, settings, options);
        static int RunMigrateUp(ILogger logger, DatabaseConnectionSettings settings, MigrateUpOptions options) => MigrateUp.Run(logger, settings);
        static int RunReset(ILogger logger, DatabaseConnectionSettings appsettings, ResetOptions options, DepartmentService departmentService) => Reset.Run(logger, appsettings, options, departmentService);
        static int RunSeed(ILogger logger, DepartmentService departmentService) => Seed.Run(logger, departmentService);
        static int RunSettingsUpdate(ILogger logger, DatabaseConnectionSettings appsettings, SetSettingsOptions options) => SettingsUpdate.Run(logger, appsettings, options);
        static int ShowErrors(ILogger logger, IEnumerable<Error> errors)
        {
            foreach (var error in errors)
            {
                logger.LogError(error.Tag.ToString());
            }

            return 1;
        }
    }
}