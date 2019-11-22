using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Dapper.Mapper;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects
{
    public abstract class BaseDao
    {
        protected readonly string _connectionString;
        protected readonly ILogger _logger;
        protected BaseDao(string connectionString, ILogger logger)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected IEnumerable<T> Query<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return connection.Query<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected T QueryFirst<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return connection.QueryFirst<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected T QueryFirstOrDefault<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return connection.QueryFirstOrDefault<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected async Task<IEnumerable<T>> QueryAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QueryAsync<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }

        protected async Task<IEnumerable<T>> QueryMapAsync<T, T1>(string sql, object parameters = null, Func<T, T1, T> map = null, string splitOn = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QueryAsync<T, T1, T>(sql, map, parameters, splitOn: splitOn);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }

        protected async Task<IEnumerable<T2>> QueryMapAsync<T, T1, T2>(string sql, object parameters = null, Func<T, T1, T2> map = null, string splitOn = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QueryAsync<T, T1, T2>(sql, map, parameters, splitOn: splitOn);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }

        protected async Task<T> QueryFirstAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QueryFirstAsync<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected T QuerySingle<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return connection.QuerySingle<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected T QuerySingleOrDefault<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return connection.QuerySingleOrDefault<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected async Task<T> QuerySingleAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QuerySingleAsync<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected async Task<T> QuerySingleOrDefaultAsync<T>(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    return await connection.QuerySingleOrDefaultAsync<T>(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }

        protected void Execute(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    connection.Execute(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
        protected async Task ExecuteAsync(string sql, object parameters = null)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    await connection.ExecuteAsync(sql, parameters);
                }
                catch (Exception exc)
                {
                    _logger.LogError(exc.Message);
                    throw exc;
                }
            }
        }
    }
}