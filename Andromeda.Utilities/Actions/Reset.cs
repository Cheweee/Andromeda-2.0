using System;
using System.IO;
using System.Threading.Tasks;
using Andromeda.Services;
using Andromeda.Shared;
using CommandLine;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Andromeda.Utilities.Actions
{
    [Verb("reset", HelpText = "Reset the DB (drop, create, migrate, seed)")]
    public class ResetOptions : SolutionSettingsOptions { }

    public class Reset
    {
        public static int Run(
            ILogger logger,
            IHostingEnvironment hostingEnvironment,
            Appsettings appsettings,
            ResetOptions options,
            DepartmentService departmentService
        )
        {
            try
            {
                bool databaseInitialized = appsettings.DatabaseConnectionSettings != null;
                if (databaseInitialized)
                {
                    logger.LogInformation($"Try to reset \"{appsettings.DatabaseConnectionSettings.DatabaseName}\" database");
                }
                else
                {
                    logger.LogInformation($"Try to initialize project database");
                }

                SettingsUpdate.Run(logger, appsettings, options);

                appsettings = JsonConvert.DeserializeObject<Appsettings>(File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json")));

                if (databaseInitialized)
                    if (Drop.Run(logger, appsettings.DatabaseConnectionSettings) > 0) throw new Exception("There was some errors with dropping database");
                if (Create.Run(logger, appsettings.DatabaseConnectionSettings) > 0) throw new Exception("There was some errors with creating database");
                if (MigrateUp.Run(logger, appsettings.DatabaseConnectionSettings) > 0) throw new Exception("There was some errors with migrating database");
                if (Seed.Run(logger, hostingEnvironment, departmentService) > 0) throw new Exception("There was some errors with migrating database");

                logger.LogInformation($"{appsettings.DatabaseConnectionSettings.DatabaseName} database successfully reseted");
                return 0;
            }
            catch (Exception exception)
            {
                logger.LogError(exception.Message);
                return 1;
            }
        }
    }
}