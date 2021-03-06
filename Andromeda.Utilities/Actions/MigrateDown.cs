using System;
using Andromeda.Models.Settings;
using CommandLine;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Andromeda.Utilities.Actions
{
    [Verb("migrate-down", HelpText = "Migrate the DB schema to the latest version")]
    public class MigrateDownOptions
    {
        [Option("migrate-version", HelpText = "Allow to migrate down to special version")]
        public long Version { get; set; }
    }
    public class MigrateDown
    {
        public static int Run(
            ILogger logger, 
            DatabaseConnectionSettings settings,
            MigrateDownOptions options)
        {
            try
            {
                logger.LogInformation($"Try to migrate \"{settings.DatabaseName}\" database");

                var serviceProvider = MigrateUtilities.CreateServices(settings);
                using (var scope = serviceProvider.CreateScope())
                {
                    // Instantiate the runner
                    var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

                    // Execute the migrations
                    runner.MigrateDown(options.Version);
                }

                logger.LogInformation($"{settings.DatabaseName} database successfully migrated");
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