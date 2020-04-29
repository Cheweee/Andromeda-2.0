using System.IO;

namespace Andromeda.Services
{
    public class FileService
    {
        private readonly string _contentRootPath;

        public FileService(string contentRootPath)
        {
            _contentRootPath = contentRootPath;
        }

        public FileStream PrepareFile(string fileName, Stream file, long? fileLength)
        {
            string folderName = "Upload";
            string contentRootPath = _contentRootPath;
            string newPath = Path.Combine(contentRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (fileLength > 0)
            {
                string fullPath = Path.Combine(newPath, fileName);
                var stream = new FileStream(fullPath, FileMode.Create);
                file.CopyTo(stream);
                stream.Position = 0;

                return stream;
            }

            return null;
        }

        public void RemoveFile(string fileName)
        {
            string folderName = "Upload";
            string contentRootPath = _contentRootPath;
            string filePath = Path.Combine(contentRootPath, folderName, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}