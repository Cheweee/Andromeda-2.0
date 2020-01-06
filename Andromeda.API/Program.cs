using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Services;
using Andromeda.Shared;
using Andromeda.Utilities.Actions;
using CommandLine;
using CommandLine.Text;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Andromeda.API
{
    [Verb("api", HelpText = "Run web api")]
    class ApiOptions { }
    public class Program
    {
        public static int Main(string[] args)
        {
            var host = BuildWebHost(args);
            Appsettings appsettings = JsonConvert.DeserializeObject<Appsettings>(
                File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"))
            );

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var hostingEnvironment = services.GetService<IHostingEnvironment>();
                var departmentService = services.GetService<DepartmentService>();


                return CommandLine.Parser.Default.ParseArguments<ApiOptions, MigrateUpOptions, MigrateDownOptions, DropOptions, CreateOptions, ResetOptions, SolutionSettingsOptions>(args)
                .MapResult(
                    (ApiOptions options) => RunApi(services.GetService<ILogger<Program>>(), host),
                    (DropOptions options) => RunDrop(services.GetService<ILogger<Drop>>(), appsettings.DatabaseConnectionSettings, options),
                    (ResetOptions options) => RunReset(services.GetService<ILogger<Reset>>(), hostingEnvironment, appsettings, options, departmentService),
                    (CreateOptions options) => RunCreate(services.GetService<ILogger<Create>>(), appsettings.DatabaseConnectionSettings, options),
                    (MigrateUpOptions options) => RunMigrateUp(services.GetService<ILogger<MigrateUp>>(), appsettings.DatabaseConnectionSettings, options),
                    (MigrateDownOptions options) => RunMigrateDown(services.GetService<ILogger<MigrateDown>>(), appsettings.DatabaseConnectionSettings, options),
                    (SolutionSettingsOptions options) => RunSettingsUpdate(services.GetService<ILogger<SettingsUpdate>>(), appsettings, options),
                    (SeedOptions options) => RunSeed(services.GetService<ILogger<Seed>>(), hostingEnvironment, departmentService),
                    errs => 1
                );
            }
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
        static int RunReset(ILogger logger, IHostingEnvironment hostingEnvironment, Appsettings appsettings, ResetOptions options, DepartmentService departmentService) => Reset.Run(logger, hostingEnvironment, appsettings, options, departmentService);
        static int RunCreate(ILogger logger, DatabaseConnectionSettings settings, CreateOptions options) => Create.Run(logger, settings);
        static int RunMigrateUp(ILogger logger, DatabaseConnectionSettings settings, MigrateUpOptions options) => MigrateUp.Run(logger, settings);
        static int RunMigrateDown(ILogger logger, DatabaseConnectionSettings settings, MigrateDownOptions options) => MigrateDown.Run(logger, settings);
        static int RunSettingsUpdate(ILogger logger, Appsettings appsettings, SolutionSettingsOptions options) => SettingsUpdate.Run(logger, appsettings, options);
        static int RunSeed(ILogger logger, IHostingEnvironment hostingEnvironment, DepartmentService departmentService) => Seed.Run(logger, hostingEnvironment, departmentService);
    }
}
