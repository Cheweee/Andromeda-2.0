using System;
using System.Data;
using System.Data.SqlClient;
using Andromeda.Shared;
using Andromeda.Shared.Enumerations;
using Andromeda.Utilities.Migrations;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Andromeda.Utilities.Actions
{
    public class MigrateUtilities
    {

        public static IDbCommand CreateCommand(DatabaseConnectionSettings settings, string command, IDbConnection connection)
        {
            switch (settings.Provider)
            {
                case DatabaseProvider.Postgres: return new NpgsqlCommand(command, connection as NpgsqlConnection);
                case DatabaseProvider.SqlServer: return new SqlCommand(command, connection as SqlConnection);
                default: return new SqlCommand(command, connection as SqlConnection);
            }
        }

        public static IDbConnection CreateServerConnection(DatabaseConnectionSettings settings)
        {
            switch (settings.Provider)
            {
                default:
                case DatabaseProvider.SqlServer: return new SqlConnection(settings.SqlServerConnectionString);
                case DatabaseProvider.Postgres: return new NpgsqlConnection(settings.PostgresConnectionString);
            }
        }

        public static IDbConnection CreateDatabaseConnection(DatabaseConnectionSettings settings)
        {
            switch (settings.Provider)
            {
                default:
                case DatabaseProvider.SqlServer: return new SqlConnection(settings.SqlServerDatabaseConnectionString);
                case DatabaseProvider.Postgres: return new NpgsqlConnection(settings.PostgresDatabaseConnectionString);
            }
        }
        
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