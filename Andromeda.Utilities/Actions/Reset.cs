using System;
using System.IO;
using Andromeda.Models.Settings;
using Andromeda.Services;
using CommandLine;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Andromeda.Utilities.Actions
{
    [Verb("reset", HelpText = "Reset the DB (drop, create, migrate, seed)")]
    public class ResetOptions : SetSettingsOptions { }

    public class Reset
    {
        public static int Run(
            ILogger logger,
            DatabaseConnectionSettings appsettings,
            ResetOptions options,
            DepartmentService departmentService
        )
        {
            try
            {
                bool databaseInitialized = appsettings != null;
                if (databaseInitialized)
                {
                    logger.LogInformation($"Try to reset \"{appsettings.DatabaseName}\" database");
                }
                else
                {
                    logger.LogInformation($"Try to initialize project database");
                }

                SettingsUpdate.Run(logger, appsettings, options);

                appsettings = JsonConvert.DeserializeObject<DatabaseConnectionSettings>(File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json")));

                if (databaseInitialized)
                    if (Drop.Run(logger, appsettings) > 0) throw new Exception("There was some errors with dropping database");
                if (Create.Run(logger, appsettings) > 0) throw new Exception("There was some errors with creating database");
                if (MigrateUp.Run(logger, appsettings) > 0) throw new Exception("There was some errors with migrating database");
                if (Seed.Run(logger, departmentService) > 0) throw new Exception("There was some errors with migrating database");

                logger.LogInformation($"{appsettings.DatabaseName} database successfully reseted");
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