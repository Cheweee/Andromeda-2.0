using System;
using System.IO;
using Andromeda.Shared;
using CommandLine;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Andromeda.Utilities.Actions
{
    [Verb("app-settings", HelpText = "Set application settings by it names")]
    public class SolutionSettingsOptions
    {
        [Option(DatabaseConnectionSettings.DatabaseHostVariableName, HelpText = "Allow to set database host")]
        public string DatabaseHostOption { get; set; }

        [Value(0, HelpText = "Allow to set database host")]
        public string DatabaseHost { get; set; }

        [Option(DatabaseConnectionSettings.DatabaseNameVariableName, HelpText = "Allow to set database name")]
        public string DatabaseNameOption { get; set; }

        [Value(1, HelpText = "Allow to set database name")]
        public string DatabaseName { get; set; }

        [Option(DatabaseConnectionSettings.DatabasePortVariableName, HelpText = "Allow to set database port", Required = false)]
        public string DatabasePortOption { get; set; }

        [Value(2, HelpText = "Allow to set database port", Required = false)]
        public string DatabasePort { get; set; }

        [Option(DatabaseConnectionSettings.DatabaseUserNameVariableName, HelpText = "Allow to set database user name")]
        public string DatabaseUserNameOption { get; set; }

        [Value(3, HelpText = "Allow to set database user name")]
        public string DatabaseUserName { get; set; }

        [Option(DatabaseConnectionSettings.DatabasePasswordVariableName, HelpText = "Allow to set database password")]
        public string DatabasePasswordOption { get; set; }

        [Value(4, HelpText = "Allow to set database password")]
        public string DatabasePassword { get; set; }

        public void InitialiazeSettings()
        {
            DatabaseHost = @"localhost\sqlexpress";
            DatabaseName = "andromeda";
            DatabasePort = "5432";
            DatabaseUserName = "sa";
            DatabasePassword = "qwerty_123";
        }
    }

    public class SettingsUpdate
    {
        public static int Run(
            ILogger logger,
            Appsettings appsettings,
            SolutionSettingsOptions options
        )
        {
            try
            {
                if (string.IsNullOrEmpty(options.DatabaseHost)
                && string.IsNullOrEmpty(options.DatabaseName)
                && string.IsNullOrEmpty(options.DatabaseUserName)
                && string.IsNullOrEmpty(options.DatabasePassword))
                {
                    options.InitialiazeSettings();
                }
                logger.LogInformation("Try to update solution settings");

                appsettings.DatabaseConnectionSettings = DatabaseConnectionSettings.InitializeSolutionSettings(
                    options.DatabaseHost,
                    options.DatabaseName,
                    options.DatabasePort,
                    options.DatabaseUserName,
                    options.DatabasePassword
                );

                File.WriteAllText(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"), JsonConvert.SerializeObject(appsettings));

                logger.LogInformation("Solution settings updated successfully");
            }
            catch (Exception exception)
            {
                logger.LogError(exception.Message);
            }
            return 0;
        }
    }
}