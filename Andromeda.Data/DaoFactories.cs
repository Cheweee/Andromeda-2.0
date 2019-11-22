using Andromeda.Data.Interfaces;
using Microsoft.Extensions.Logging;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data
{
    public class DaoFactories
    {
        public static IDaoFactory GetFactory(DataProvider provider, string connectionString, ILogger logger)
        {
            switch (provider)
            {
                case DataProvider.MSSql:
                    return new DataAccessObjects.MSSql.DaoFactory(connectionString, logger);
                default:
                    return new DataAccessObjects.MSSql.DaoFactory(connectionString, logger);
            }
        }
    }
}