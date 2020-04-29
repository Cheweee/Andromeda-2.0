using Andromeda.Data.Interfaces;
using Microsoft.Extensions.Logging;
using Andromeda.Models.Settings.Enumerations;
using Andromeda.Models.Settings;

namespace Andromeda.Data
{
    public class DaoFactories
    {
        public static IDaoFactory GetFactory(DatabaseConnectionSettings settings, ILogger logger)
        {
            switch (settings.Provider)
            {
                case DatabaseProvider.SqlServer:
                    return new DataAccessObjects.SqlServer.DaoFactory(settings, logger);
                default:
                    return new DataAccessObjects.SqlServer.DaoFactory(settings, logger);
            }
        }
    }
}