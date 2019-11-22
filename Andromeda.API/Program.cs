using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Shared;
using Andromeda.Utilities.Actions;
using CommandLine;
using CommandLine.Text;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Andromeda.API
{
    [Verb("api", HelpText = "Run web api")]
    class ApiOptions { }
    public class Program
    {
        public static int Main(string[] args)
        {
            var host = BuildWebHost(args);
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");
            var configuration = configurationBuilder.Build();
            var settings = configuration.Get<DatabaseConnectionSettings>();

            return CommandLine.Parser.Default.ParseArguments<ApiOptions, MigrateUpOptions, MigrateDownOptions, DropOptions, CreateOptions, ResetOptions, SolutionSettingsOptions>(args)
            .MapResult(
                (ApiOptions options) => RunApi(host.Services.GetService<ILogger<Program>>(), host),
                (DropOptions options) => RunDrop(host.Services.GetService<ILogger<Drop>>(), settings, options),
                (ResetOptions options) => RunReset(host.Services.GetService<ILogger<Reset>>(), options),
                (CreateOptions options) => RunCreate(host.Services.GetService<ILogger<Create>>(), settings, options),
                (MigrateUpOptions options) => RunMigrateUp(host.Services.GetService<ILogger<MigrateUp>>(), settings, options),
                (MigrateDownOptions options) => RunMigrateDown(host.Services.GetService<ILogger<MigrateDown>>(), settings, options),
                (SolutionSettingsOptions options) => RunSettingsUpdate(host.Services.GetService<ILogger<SettingsUpdate>>(), options),
                errs => 1
            );
        }

        static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .ConfigureLogging(builder =>
                {
                    builder.ClearProviders();
                    builder.AddConsole();
                })
                .UseStartup<Startup>().Build();
        }

        static int RunApi(ILogger logger, IWebHost host)
        {
            try
            {
                host.Run();

                return 0;
            }
            catch (Exception exception)
            {
                logger.LogError(exception.Message);
                return 1;
            }
        }
        static int RunDrop(ILogger logger, DatabaseConnectionSettings settings, DropOptions options) => Drop.Run(logger, settings);
        static int RunReset(ILogger logger, ResetOptions options) => Reset.Run(logger, options);
        static int RunCreate(ILogger logger, DatabaseConnectionSettings settings, CreateOptions options) => Create.Run(logger, settings);
        static int RunMigrateUp(ILogger logger, DatabaseConnectionSettings settings, MigrateUpOptions options) => MigrateUp.Run(logger, settings);
        static int RunMigrateDown(ILogger logger, DatabaseConnectionSettings settings, MigrateDownOptions options) => MigrateDown.Run(logger, settings);
        static int RunSettingsUpdate(ILogger logger, SolutionSettingsOptions options) => SettingsUpdate.Run(logger, options);
    }
}
