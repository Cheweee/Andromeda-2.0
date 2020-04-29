using System;
using CommandLine;
using Andromeda.Services;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Newtonsoft.Json;
using Andromeda.Models.Entities;

namespace Andromeda.Utilities.Actions
{
    [Verb("seed", HelpText = "Initialize database data")]
    public class SeedOptions { }
    public class Seed
    {
        public static int Run(
            ILogger logger,
            DepartmentService departmentService
        )
        {
            try
            {
                string folderName = "Seed";
                string contentRootPath = Directory.GetCurrentDirectory();
                string folderPath = Path.Combine(contentRootPath, folderName);
                if (!Directory.Exists(folderPath))
                    throw new IOException("Папка с файлами инициализации базы данных не найдена.");
                #region Seed faculties
                string facultiesFilePath = Path.Combine(folderPath, "faculties.json");
                if (!File.Exists(facultiesFilePath))
                    throw new IOException("Файл инициализации факультетов не найден.");
                List<Department> faculties = JsonConvert.DeserializeObject<List<Department>>(File.ReadAllText(facultiesFilePath));

                foreach (var faculty in faculties)
                {
                    departmentService.Create(faculty).Wait();
                }

                #endregion
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