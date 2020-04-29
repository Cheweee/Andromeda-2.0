using System;
using Andromeda.Models.Settings;
using Andromeda.Models.Settings.Enumerations;
using Andromeda.Utilities.Migrations;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;

namespace Andromeda.Utilities.Actions
{
    public class MigrateUtilities
    {        
        public static IServiceProvider CreateServices(DatabaseConnectionSettings settings)
        {
            return new ServiceCollection()
                // Add common FluentMigrator services
                .AddFluentMigratorCore()
                .ConfigureRunner(rb =>
                {
                    switch (settings.Provider)
                    {
                        default:
                        case DatabaseProvider.SqlServer:
                            // Add SqlServer support to FluentMigrator
                            rb.AddSqlServer()
                            .WithGlobalConnectionString(settings.SqlServerDatabaseConnectionString);
                            break;
                        case DatabaseProvider.Postgres:
                            // Add Postgres support to FluentMigrator
                            rb.AddPostgres()
                            .WithGlobalConnectionString(settings.PostgresDatabaseConnectionString);
                            break;

                    }
                    // Define the assembly containing the migrations                    
                    rb.ScanIn(typeof(CreateUser).Assembly).For.Migrations();
                })
                // Enable logging to console in the FluentMigrator way
                .AddLogging(lb => lb.AddFluentMigratorConsole())
                // Build the service provider
                .BuildServiceProvider(false);
        }
    }
}