namespace Andromeda.Shared
{
    public class DatabaseConnectionSettings
    {
        #region Private variables
        private string databaseHost;
        private string databaseName;
        private string databasePort;
        private string databaseUserName;
        private string databasePassword;
        #endregion

        #region Environment variables names
        public const string DatabaseHostVariableName = "database-host";

        public const string DatabaseNameVariableName = "database-name";

        public const string DatabasePortVariableName = "database-port";

        public const string DatabaseUserNameVariableName = "database-user-name";

        public const string DatabasePasswordVariableName = "database-password";
        #endregion

        public string PostgresConnectionString { get => $"host={databaseHost};port={databasePort};username={databaseUserName};password={databasePassword}"; }

        public string SqlServerConnectionString { get => $"data source={databaseHost};user id={databaseUserName};password={databasePassword};"; }

        public string SqlServerDatabaseConnectionString { get => $"{SqlServerConnectionString};initial catalog={databaseName};"; }

        public string PostgresDatabaseConnectionString { get => $"{PostgresConnectionString};database={databaseName};"; }

        public string DatabaseHost { get => databaseHost; set => databaseHost = value; }
        public string DatabaseName { get => databaseName; set => databaseName = value; }
        public string DatabasePort { get => databasePort; set => databasePort = value; }
        public string DatabaseUserName { get => databaseUserName; set => databaseUserName = value; }
        public string DatabasePassword { get => databasePassword; set => databasePassword = value; }

        public static DatabaseConnectionSettings InitializeSolutionSettings(string databaseHost, string databaseName, string databasePort, string databaseUserName, string databasePassword)
        {
            return new DatabaseConnectionSettings
            {
                databaseHost = databaseHost,
                databaseName = databaseName,
                databasePassword = databasePassword,
                databasePort = databasePort,
                databaseUserName = databaseUserName
            };
        }
    }
}