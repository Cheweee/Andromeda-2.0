using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace Andromeda.Services
{
    public class FileService
    {
        private readonly string _contentRootPath;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FileService(string contentRootPath,
            IHttpContextAccessor httpContextAccessor)
        {
            _contentRootPath = contentRootPath;
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentException(nameof(httpContextAccessor));
        }

        public async Task<FileStream> PrepareFile(string fileName)
        {
            try
            {
                Stream file = _httpContextAccessor.HttpContext.Request.Body;
                string fileContentType = _httpContextAccessor.HttpContext.Request.ContentType;
                long? fileContentLength = _httpContextAccessor.HttpContext.Request.ContentLength;

                string folderName = "Upload";
                string uplodaFolderPath = Path.Combine(_contentRootPath, folderName);

                if (!Directory.Exists(uplodaFolderPath))
                {
                    Directory.CreateDirectory(uplodaFolderPath);
                }
                if (fileContentLength > 0)
                {
                    string fullPath = Path.Combine(uplodaFolderPath, fileName);
                    var stream = new FileStream(fullPath, FileMode.Create);
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    return stream;
                }

                return null;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        public void RemoveFile(string fileName)
        {
            string folderName = "Upload";
            string filePath = Path.Combine(_contentRootPath, folderName, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}