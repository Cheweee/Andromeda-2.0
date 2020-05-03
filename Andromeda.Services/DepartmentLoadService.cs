using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Services.GenerateLoadStrategies;
using Andromeda.Shared;
using NPOI.SS.UserModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System.Data;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using Andromeda.Models.Entities;
using Andromeda.Models.Enumerations;

namespace Andromeda.Services
{
    public class DepartmentLoadService
    {
        private readonly IDepartmentLoadDao _dao;
        private readonly DepartmentService _departmentService;
        private readonly DisciplineTitleService _disciplineTitleService;
        private readonly StudentGroupService _studentGroupService;
        private readonly GroupDisciplineLoadService _groupDisciplineLoadService;
        private readonly StudyLoadService _studyLoadService;
        private readonly StudyDirectionService _studyDirectionService;
        private readonly FileService _fileService;

        private readonly IGenerateStrategy _generateStrategy;
        private readonly ILogger<DepartmentLoadService> _logger;

        public DepartmentLoadService(
            IDepartmentLoadDao dao,
            DepartmentService departmentService,
            DisciplineTitleService disciplineTitleService,
            StudentGroupService studentGroupService,
            GroupDisciplineLoadService groupDisciplineLoadService,
            StudyLoadService studyLoadService,
            StudyDirectionService studyDirectionService,
            FileService fileService,
            IGenerateStrategy generateStrategy,
            ILogger<DepartmentLoadService> logger
        )
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
            _departmentService = departmentService ?? throw new ArgumentException(nameof(departmentService));
            _disciplineTitleService = disciplineTitleService ?? throw new ArgumentException(nameof(disciplineTitleService));
            _studentGroupService = studentGroupService ?? throw new ArgumentException(nameof(studentGroupService));
            _groupDisciplineLoadService = groupDisciplineLoadService ?? throw new ArgumentException(nameof(groupDisciplineLoadService));
            _studyLoadService = studyLoadService ?? throw new ArgumentException(nameof(studyLoadService));
            _studyDirectionService = studyDirectionService ?? throw new ArgumentException(nameof(studyDirectionService));
            _fileService = fileService ?? throw new ArgumentException(nameof(fileService));

            _generateStrategy = generateStrategy ?? throw new ArgumentException(nameof(generateStrategy));

            _logger = logger ?? throw new ArgumentException(nameof(logger));
        }

        public async Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options)
        {
            var loads = await _dao.Get(options);
            var loadsIds = loads.Select(o => o.Id).ToList();

            var groupDisciplineLoad = await _groupDisciplineLoadService.Get(new GroupDisciplineLoadGetOptions
            {
                DepartmentLoadsIds = loadsIds
            });

            var disciplinesTitles = await _disciplineTitleService.Get(new DisciplineTitleGetOptions
            {
                DepartmentLoadsIds = loadsIds
            });

            var studentGroups = await _studentGroupService.Get(new StudentGroupGetOptions
            {
                DepartmentLoadsIds = loadsIds
            });

            foreach (var load in loads)
            {
                load.GroupDisciplineLoad = groupDisciplineLoad.Where(o => o.DepartmentLoadId == load.Id).ToList();
            }

            return loads;
        }

        public async Task<DepartmentLoad> Create(DepartmentLoad model)
        {
            await _dao.Create(model);

            if (model.GroupDisciplineLoad != null)
            {
                await UpdateGroupDisciplineLoad(model.Id, model.GroupDisciplineLoad);
            }
            return model;
        }

        public async Task<DepartmentLoad> Update(DepartmentLoad model)
        {
            await _dao.Update(model);

            if (model.GroupDisciplineLoad != null)
            {
                await UpdateGroupDisciplineLoad(model.Id, model.GroupDisciplineLoad);
            }
            return model;
        }

        public async Task<DepartmentLoad> Generate(DepartmentLoad model)
        {
            await _generateStrategy.Generate(model);
            return model;
        }

        public async Task<DepartmentLoad> Import(DepartmentLoadImportOptions options)
        {
            try
            {
                if (!options.DepartmentId.HasValue)
                    throw new ApplicationException("Не удалось найти кафедру.");

                DepartmentLoad departmentLoad = new DepartmentLoad
                {
                    DepartmentId = options.DepartmentId.Value
                };
                var departments = await _departmentService.Get(new DepartmentGetOptions { Id = options.DepartmentId });
                var department = departments.FirstOrDefault();
                List<DisciplineTitle> disciplinesTitles = new List<DisciplineTitle>();
                List<StudentGroup> studentGroups = new List<StudentGroup>();
                IEnumerable<StudyDirection> studyDirections = await _studyDirectionService.Get(new StudyDirectionGetOptions());
                IEnumerable<Department> faculties = await _departmentService.Get(new DepartmentGetOptions
                {
                    Type = DepartmentType.Faculty
                });

                using (var fileStream = await _fileService.PrepareFile(options.FileName))
                {
                    IWorkbook workbook = WorkbookFactory.Create(fileStream);
                    ISheet loadSheet = null;
                    for (int i = 0; i < workbook.NumberOfSheets; i++)
                    {
                        var sheet = workbook.GetSheetAt(i);
                        if (sheet.SheetName.ToLower().Contains(department.Name.ToLower())
                        || sheet.SheetName.ToLower().Contains(department.FullName.ToLower()))
                        {
                            loadSheet = sheet;
                            break;
                        }
                    }

                    if (loadSheet == null)
                    {
                        throw new ApplicationException("Не удалось найти лист с нагрузкой кафедры");
                    }

                    GetStudyYearFromSheet(departmentLoad, loadSheet);
                    GetLoadFromSheet(
                        departmentLoad,
                        loadSheet,
                        studyDirections.ToList(),
                        faculties.ToList(),
                        disciplinesTitles,
                        studentGroups
                    );
                    GetTotalLoad(departmentLoad, loadSheet);
                }

                if (options.UpdateStudentsGroups)
                {
                    var groups = new List<StudentGroup>();
                    var departmentGroups = studentGroups.Where(o => o.DepartmentId == options.DepartmentId).ToList();
                    foreach (var group in departmentGroups)
                    {
                        var direction = group.StudyDirection;
                        if (direction != null)
                        {
                            groups.Add(group);
                        }
                    }
                    await _departmentService.UpdateDepartmentStudentsGroups(options.DepartmentId.Value, groups);
                }

                if (options.UpdateDisciplinesTitles)
                {
                    await _departmentService.UpdateDepartmentDisciplinesTitles(options.DepartmentId.Value, disciplinesTitles);
                }

                var newGroups = await _studentGroupService.Get(new StudentGroupGetOptions());
                var newTitles = await _disciplineTitleService.Get(new DisciplineTitleGetOptions());

                foreach (var load in departmentLoad.GroupDisciplineLoad)
                {
                    var title = newTitles.FirstOrDefault(o => o.Name == load.DisciplineTitle.Name);
                    if (title != null)
                        load.DisciplineTitleId = title.Id;

                    var group = newGroups.FirstOrDefault(o => o.Name == load.StudentGroup.Name);
                    if (group != null)
                        load.StudentGroupId = group.Id;

                    load.StudyLoad.ForEach(o => o.UsersLoad = new List<UserLoad>());
                }

                departmentLoad.GroupDisciplineLoad = departmentLoad.GroupDisciplineLoad.Where(o => newGroups.Any(g => g.Id == o.StudentGroupId)
                && newTitles.Any(t => t.Id == o.DisciplineTitleId)).ToList();
                await Create(departmentLoad);
                return departmentLoad;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
            finally
            {
                _fileService.RemoveFile(options.FileName);
            }
        }

        public async Task Delete(IReadOnlyList<int> ids) => await _dao.Delete(ids);

        private async Task UpdateGroupDisciplineLoad(int departmentLoadId, IEnumerable<GroupDisciplineLoad> models)
        {
            var old = await _groupDisciplineLoadService.Get(new GroupDisciplineLoadGetOptions { DepartmentLoadId = departmentLoadId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = models.Where(o => old.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.DepartmentLoadId = departmentLoadId);

            await _groupDisciplineLoadService.Delete(toDelete);
            foreach (var entity in toUpdate)
                await _groupDisciplineLoadService.Update(entity);
            foreach (var entity in toCreate)
                await _groupDisciplineLoadService.Create(entity);
        }

        private void GetStudyYearFromSheet(DepartmentLoad departmentLoad, ISheet loadSheet)
        {
            for (int i = 0; i < loadSheet.LastRowNum; i++)
            {
                var row = loadSheet.GetRow(i);
                CheckRow(row);

                for (int j = 0; j < row.LastCellNum; j++)
                {
                    var cell = row.GetCell(j);

                    if (cell != null && cell.StringCellValue.ToLower().Contains("уч.год:"))
                    {
                        var studyYears = cell.StringCellValue.ToLower().Replace("уч.год: ", "").Replace(" ", "").Split('-');
                        string startYear = studyYears.FirstOrDefault();
                        string endYear = studyYears.LastOrDefault();
                        string currentCentury = DateTime.Now.Year.ToString("").Substring(0, 2);
                        endYear = currentCentury + endYear;
                        departmentLoad.StudyYear = startYear + "-" + endYear;
                        return;
                    }
                }
            }
        }

        private void GetLoadFromSheet(
            DepartmentLoad departmentLoad,
            ISheet loadSheet,
            List<StudyDirection> studyDirections,
            List<Department> faculties,
            List<DisciplineTitle> disciplinesTitles,
            List<StudentGroup> studentGroups
        )
        {
            #region Define columns numbers
            const int disciplineTitleColumn = 1;
            const int semesterColumn = 2;
            const int studyDirectionColumn = 3;
            const int facultyColumn = 4;
            const int courseColumn = 5;
            const int studentGroupColumn = 6;
            const int studentsCountColumn = 7;
            const int groupsInStreamColumn = 8;
            const int studyWeeksColumn = 9;
            const int lectionsColumn = 10;
            const int practicalLessonsColumn = 11;
            const int laboratoryLessonsColumn = 12;
            const int thematicalDiscussionsColumn = 13;
            const int consultasionsColumn = 14;
            const int examsColumn = 15;
            const int offsetsColumn = 16;
            const int otherColumn = 17;
            const int abstractsColumn = 18;
            const int esTestPapersColumn = 19;
            const int stateExamsColumn = 20;
            const int postgraduateExamsColumn = 21;
            const int practicesColumn = 22;
            const int departmentManagementColumn = 23;
            const int studentReserachWorkColumn = 24;
            const int courseWorksColumn = 25;
            const int graduationQualificationManagementColumn = 26;
            const int masterProgramManagementColumn = 27;
            const int postgraduateProgramManagementColumn = 28;
            const int amountColumn = 29;
            #endregion

            int? firstRowIndex = GetFirstRowIndex(loadSheet);
            if (!firstRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");
            int? lastRowIndex = GetLastRowIndex(loadSheet, firstRowIndex.Value);
            if (!lastRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");
            int firstRow = firstRowIndex.Value + 1;

            for (int i = firstRow; i < lastRowIndex; i++)
            {
                var row = loadSheet.GetRow(i);
                CheckRow(row);

                #region Define required cells
                var disciplineTitleCell = row.GetCell(disciplineTitleColumn);
                var semesterCell = row.GetCell(semesterColumn);
                var studyDirectionCell = row.GetCell(studyDirectionColumn);
                var facultyCell = row.GetCell(facultyColumn);
                var courseCell = row.GetCell(courseColumn);
                var studentGroupCell = row.GetCell(studentGroupColumn);
                var studentsCountCell = row.GetCell(studentsCountColumn);
                var groupsInStreamCell = row.GetCell(groupsInStreamColumn);
                var studyWeeksCell = row.GetCell(studyWeeksColumn);
                var lectionsCell = row.GetCell(lectionsColumn);
                var practicalLessonsCell = row.GetCell(practicalLessonsColumn);
                var laboratoryLessonsCell = row.GetCell(laboratoryLessonsColumn);
                var thematicalDiscussionsCell = row.GetCell(thematicalDiscussionsColumn);
                var consultasionsCell = row.GetCell(consultasionsColumn);
                var examsCell = row.GetCell(examsColumn);
                var offsetsCell = row.GetCell(offsetsColumn);
                var otherCell = row.GetCell(otherColumn);
                var abstractCell = row.GetCell(abstractsColumn);
                var esTestPapersCell = row.GetCell(esTestPapersColumn);
                var stateExamsCell = row.GetCell(stateExamsColumn);
                var postgraduateExamsCell = row.GetCell(postgraduateExamsColumn);
                var practicesCell = row.GetCell(practicesColumn);
                var departmentManagementCell = row.GetCell(departmentManagementColumn);
                var studentReserachWorkCell = row.GetCell(studentReserachWorkColumn);
                var courseWorksCell = row.GetCell(courseWorksColumn);
                var graduationQualificationManagementCell = row.GetCell(graduationQualificationManagementColumn);
                var masterProgramManagementCell = row.GetCell(masterProgramManagementColumn);
                var postgraduateProgramManagementCell = row.GetCell(postgraduateProgramManagementColumn);
                var amountCell = row.GetCell(amountColumn);
                #endregion

                #region Check required cells
                CheckCell(disciplineTitleCell);
                CheckCell(semesterCell);
                CheckCell(studyDirectionCell);
                CheckCell(facultyCell);
                CheckCell(courseCell);
                CheckCell(studentGroupCell);
                CheckCell(studentsCountCell);
                CheckCell(groupsInStreamCell);
                CheckCell(studyWeeksCell);
                #endregion

                #region Get values from cells
                string tempStartYear = Regex.Match(studentGroupCell.StringCellValue, @"[а-я,А-Я]\d{2}").Value;
                int startYear = int.Parse(Regex.Match(tempStartYear, @"\d{2}").Value);
                string directionCode = Regex.Match(studyDirectionCell.StringCellValue, @"\d{2}.\d{2}.\d{2}").Value;
                var studyDirection = studyDirections.Find(o => directionCode == o.Code);

                var title = new DisciplineTitle
                {
                    DepartmentId = departmentLoad.DepartmentId,
                    Name = disciplineTitleCell.StringCellValue,
                    Shortname = disciplineTitleCell.StringCellValue.GetShortening()
                };

                if (!disciplinesTitles.Any(o => o.Name == title.Name))
                    disciplinesTitles.Add(title);

                if (studyDirection != null)
                {
                    var group = new StudentGroup
                    {
                        CurrentCourse = Convert.ToInt32(courseCell.NumericCellValue),
                        DepartmentId = studyDirection.DepartmentId,
                        Name = studentGroupCell.StringCellValue,
                        StartYear = startYear,
                        StudentsCount = Convert.ToInt32(studentsCountCell.NumericCellValue),
                        StudyDirection = studyDirection,
                        StudyDirectionId = studyDirection.Id
                    };
                    if (!studentGroups.Any(o => o.Name == group.Name))
                        studentGroups.Add(group);

                    var faculty = faculties.Find(o => o.Name == facultyCell.StringCellValue
                    || o.FullName == facultyCell.StringCellValue);

                    int semesterNumber = Convert.ToInt32(semesterCell.NumericCellValue);
                    int studyWeeksCount = Convert.ToInt32(studyWeeksCell.NumericCellValue);
                    double amount = amountCell.NumericCellValue;

                    var groupDisciplineLoad = new GroupDisciplineLoad
                    {
                        DisciplineTitle = title,
                        DisciplineTitleId = title.Id,
                        Faculty = faculty,
                        FacultyId = faculty.Id,
                        SemesterNumber = semesterNumber,
                        StudentGroup = group,
                        StudentGroupId = group.Id,
                        StudyWeeksCount = studyWeeksCount,
                        StudyLoad = new List<StudyLoad>(),
                        Amount = amount
                    };

                    if (lectionsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(lectionsCell),
                            ShownValue = GetShownValueFromCell(lectionsCell),
                            ProjectType = ProjectType.Lection
                        });
                    if (practicalLessonsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(practicalLessonsCell),
                            ShownValue = GetShownValueFromCell(practicalLessonsCell),
                            ProjectType = ProjectType.PracticalLesson
                        });
                    if (laboratoryLessonsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(laboratoryLessonsCell),
                            ShownValue = GetShownValueFromCell(laboratoryLessonsCell),
                            ProjectType = ProjectType.LaboratoryLesson
                        });
                    if (thematicalDiscussionsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(thematicalDiscussionsCell),
                            ShownValue = GetShownValueFromCell(thematicalDiscussionsCell),
                            ProjectType = ProjectType.ThematicalDiscussion
                        });
                    if (consultasionsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(consultasionsCell),
                            ShownValue = GetShownValueFromCell(consultasionsCell),
                            ProjectType = ProjectType.Consultation
                        });
                    if (examsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(examsCell),
                            ShownValue= GetShownValueFromCell(examsCell),
                            ProjectType = ProjectType.Exam
                        });
                    if (offsetsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(offsetsCell),
                            ShownValue = GetShownValueFromCell(offsetsCell),
                            ProjectType = ProjectType.Offest
                        });
                    if (otherCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(otherCell),
                            ShownValue = GetShownValueFromCell(otherCell),
                            ProjectType = ProjectType.Other
                        });
                    if (abstractCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(abstractCell),
                            ShownValue = GetShownValueFromCell(abstractCell),
                            ProjectType = ProjectType.Abstract
                        });
                    if (esTestPapersCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(esTestPapersCell),
                            ShownValue = GetShownValueFromCell(esTestPapersCell),
                            ProjectType = ProjectType.EsTestPapers
                        });
                    if (stateExamsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(stateExamsCell),
                            ShownValue = GetShownValueFromCell(stateExamsCell),
                            ProjectType = ProjectType.StateExam
                        });
                    if (postgraduateExamsCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(postgraduateExamsCell),
                            ShownValue = GetShownValueFromCell(postgraduateExamsCell),
                            ProjectType = ProjectType.PostgraduateEntranceExam
                        });
                    if (practicesCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(practicesCell),
                            ShownValue = GetShownValueFromCell(practicesCell),
                            ProjectType = ProjectType.Practice
                        });
                    if (departmentManagementCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(departmentManagementCell),
                            ShownValue = GetShownValueFromCell(departmentManagementCell),
                            ProjectType = ProjectType.DepartmentManagement
                        });
                    if (studentReserachWorkCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(studentReserachWorkCell),
                            ShownValue = GetShownValueFromCell(studentReserachWorkCell),
                            ProjectType = ProjectType.StudentResearchWork
                        });
                    if (courseWorksCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(courseWorksCell),
                            ShownValue = GetShownValueFromCell(courseWorksCell),
                            ProjectType = ProjectType.CourseWork
                        });
                    if (graduationQualificationManagementCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(graduationQualificationManagementCell),
                            ShownValue = GetShownValueFromCell(graduationQualificationManagementCell),
                            ProjectType = ProjectType.GraduationQualificationManagement
                        });
                    if (masterProgramManagementCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(masterProgramManagementCell),
                            ShownValue = GetShownValueFromCell(masterProgramManagementCell),
                            ProjectType = ProjectType.MasterProgramManagement
                        });
                    if (postgraduateProgramManagementCell != null)
                        groupDisciplineLoad.StudyLoad.Add(new StudyLoad
                        {
                            Value = GetValueFromCell(postgraduateProgramManagementCell),
                            ShownValue = GetShownValueFromCell(postgraduateProgramManagementCell),
                            ProjectType = ProjectType.PostgraduateProgramManagement
                        });
                    
                    departmentLoad.GroupDisciplineLoad.Add(groupDisciplineLoad);
                }
                #endregion
            }
        }

        private void GetTotalLoad(DepartmentLoad departmentLoad, ISheet loadSheet)
        {
            int? firstLoadRowIndex = GetFirstRowIndex(loadSheet);
            if (!firstLoadRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");
            int? lastLoadRowIndex = GetLastRowIndex(loadSheet, firstLoadRowIndex.Value);
            if (!lastLoadRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");

            for (int i = lastLoadRowIndex.Value; i < loadSheet.LastRowNum; i++)
            {
                var row = loadSheet.GetRow(i);
                const int totalColumn = 29;
                const string totalStringValue = "Всего часов";

                if (row != null && row.Cells.Any(o => o.StringCellValue == totalStringValue))
                {
                    var totalCell = row.GetCell(totalColumn);
                    departmentLoad.Total = totalCell.NumericCellValue;
                    return;
                }
            }
        }

        private int? GetFirstRowIndex(ISheet sheet)
        {
            int? rowNumber = null;
            for (int i = 0; i < sheet.LastRowNum; i++)
            {
                var row = sheet.GetRow(i);
                if (row == null)
                    continue;

                for (int j = 0; j < row.LastCellNum; j++)
                {
                    var cell = row.GetCell(j);

                    if (cell != null && cell.CellType == CellType.Numeric && cell.NumericCellValue == j + 1)
                    {
                        rowNumber = i;
                        break;
                    }
                }

                if (rowNumber.HasValue)
                    break;
            }

            return rowNumber;
        }

        private int? GetLastRowIndex(ISheet sheet, int firstNumberRow)
        {
            int? rowNumber = null;
            for (int i = firstNumberRow; i < sheet.LastRowNum; i++)
            {
                var row = sheet.GetRow(i);
                if (row == null)
                {
                    rowNumber = i;
                    break;
                }
                CheckRow(row);

                var cell = row.GetCell(0);

                if (cell == null || cell.CellType != CellType.Numeric)
                {
                    rowNumber = i;
                    break;
                }

                if (rowNumber.HasValue)
                    break;
            }

            return rowNumber;
        }

        private void CheckRow(IRow row)
        {
            if (row == null)
                throw new ApplicationException("Ошибка индекса строки.");
        }

        private void CheckCell(ICell cell)
        {
            if (cell == null)
                throw new ApplicationException("Ошибка индекса ячейки.");
        }

        private string GetShownValueFromCell(ICell cell)
        {
            switch(cell.CellType)
            {
                case CellType.Numeric: return cell.NumericCellValue.ToString();
                case CellType.String: return cell.StringCellValue;
                default: return null;
            }
        }

        private double GetValueFromCell(ICell cell)
        {
            if (cell.CellType == CellType.Numeric)
                return cell.NumericCellValue;

            string cellValue = cell.StringCellValue.Replace(',', '.');
            double result = Convert.ToDouble(new DataTable().Compute(cellValue, null));
            return result;
        }
    }
}