using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data.Enumerations;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Services.GenerateLoadStrategies;
using Andromeda.Shared;
using NPOI.SS.UserModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using System.Data;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace Andromeda.Services
{
    public class DepartmentLoadService
    {
        private readonly IDepartmentLoadDao _dao;
        private readonly DepartmentService _departmentService;
        private readonly DisciplineTitleService _disciplineTitleService;
        private readonly StudentGroupService _studentGroupService;
        private readonly StudyLoadService _studyLoadService;
        private readonly StudyDirectionService _studyDirectionService;

        private readonly IGenerateStrategy _generateStrategy;

        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<DepartmentLoadService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DepartmentLoadService(
            IDepartmentLoadDao dao,
            DepartmentService departmentService,
            DisciplineTitleService disciplineTitleService,
            StudentGroupService studentGroupService,
            StudyLoadService studyLoadService,
            StudyDirectionService studyDirectionService,
            IGenerateStrategy generateStrategy,
            IHostingEnvironment hostingEnvironment,
            ILogger<DepartmentLoadService> logger,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
            _departmentService = departmentService ?? throw new ArgumentException(nameof(departmentService));
            _disciplineTitleService = disciplineTitleService ?? throw new ArgumentException(nameof(disciplineTitleService));
            _studentGroupService = studentGroupService ?? throw new ArgumentException(nameof(studentGroupService));
            _studyLoadService = studyLoadService ?? throw new ArgumentException(nameof(studyLoadService));
            _studyDirectionService = studyDirectionService ?? throw new ArgumentException(nameof(studyDirectionService));

            _generateStrategy = generateStrategy ?? throw new ArgumentException(nameof(generateStrategy));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentException(nameof(hostingEnvironment));
            _logger = logger ?? throw new ArgumentException(nameof(logger));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentException(nameof(httpContextAccessor));
        }

        public async Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options)
        {
            var loads = await _dao.Get(options);
            var loadsIds = loads.Select(o => o.Id).ToList();

            var studyLoad = await _studyLoadService.Get(new StudyLoadGetOptions
            {
                DepartmentLoadsIds = loadsIds
            });

            foreach (var load in loads)
            {
                load.StudyLoad = studyLoad.Where(o => o.DepartmentLoadId == load.Id);
            }

            return loads;
        }

        public async Task<DepartmentLoad> Create(DepartmentLoad model)
        {
            await _dao.Create(model);

            if (model.StudyLoad != null)
            {
                await UpdateStudyLoad(model.Id, model.StudyLoad);
            }
            return model;
        }

        public async Task<DepartmentLoad> Update(DepartmentLoad model)
        {
            await _dao.Update(model);

            if (model.StudyLoad != null)
            {
                await UpdateStudyLoad(model.Id, model.StudyLoad);
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

                Stream file = _httpContextAccessor.HttpContext.Request.Body;
                string fileContentType = _httpContextAccessor.HttpContext.Request.ContentType;
                long? fileContentLength = _httpContextAccessor.HttpContext.Request.ContentLength;
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

                using (var fileStream = PrepareFile(options.FileName, file, fileContentLength))
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

                foreach (var load in departmentLoad.StudyLoad)
                {
                    var title = newTitles.FirstOrDefault(o => o.Name == load.DisciplineTitle.Name);
                    if (title != null)
                        load.DisciplineTitleId = title.Id;

                    var group = newGroups.FirstOrDefault(o => o.Name == load.StudentGroup.Name);
                    if (group != null)
                        load.StudentGroupId = group.Id;
                }

                departmentLoad.StudyLoad = departmentLoad.StudyLoad.Where(o => newGroups.Any(g => g.Id == o.StudentGroupId)
                && newTitles.Any(t => t.Id == o.DisciplineTitleId));
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
                RemoveFile(options.FileName);
            }
        }

        public async Task Delete(IReadOnlyList<int> ids) => await _dao.Delete(ids);

        private async Task UpdateStudyLoad(int departmentLoadId, IEnumerable<StudyLoad> models)
        {
            var old = await _studyLoadService.Get(new StudyLoadGetOptions { DepartmentLoadId = departmentLoadId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.DepartmentLoadId = departmentLoadId);

            await _studyLoadService.Delete(toDelete);
            await _studyLoadService.Update(toUpdate);
            await _studyLoadService.Create(toCreate);
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
            #endregion

            int? firstRowIndex = GetFirstRowIndex(loadSheet);
            if (!firstRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");
            int? lastRowIndex = GetLastRowIndex(loadSheet, firstRowIndex.Value);
            if (!lastRowIndex.HasValue)
                throw new ApplicationException("Ошибка формата файла.");
            int firstRow = firstRowIndex.Value + 1;

            #region Define values arrays
            List<StudyLoad> studyLoad = new List<StudyLoad>();
            List<int> semesters = new List<int>();
            List<int> groupsInTheStream = new List<int>();
            List<int> studyWeeks = new List<int>();
            List<double> lections = new List<double>();
            List<double> practicalLessons = new List<double>();
            List<double> laboratoryLessons = new List<double>();
            List<double> thematicalDiscussions = new List<double>();
            List<double> consultasions = new List<double>();
            List<double> exams = new List<double>();
            List<double> offsets = new List<double>();
            List<double> others = new List<double>();
            List<double> abstracts = new List<double>();
            List<double> esTestPapers = new List<double>();
            List<double> stateExams = new List<double>();
            List<double> postgraduateExams = new List<double>();
            List<double> practices = new List<double>();
            List<double> departmentManagements = new List<double>();
            List<double> studentResearchs = new List<double>();
            List<double> courseWorks = new List<double>();
            List<double> graduationQualificationManagements = new List<double>();
            List<double> masterProgramManagements = new List<double>();
            List<double> postgraduateProgramManagements = new List<double>();
            #endregion

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
                    int groups = Convert.ToInt32(groupsInStreamCell.NumericCellValue);
                    int studyWeeksCount = Convert.ToInt32(studyWeeksCell.NumericCellValue);

                    double lectionsValue = lectionsCell != null ? ConvertCellValueToDouble(lectionsCell) : 0;
                    double practicalLessonsValue = practicalLessonsCell != null ? ConvertCellValueToDouble(practicalLessonsCell) : 0;
                    double laboratoryLessonsValue = laboratoryLessonsCell != null ? ConvertCellValueToDouble(laboratoryLessonsCell) : 0;
                    double thematicalDiscussionsValue = thematicalDiscussionsCell != null ? ConvertCellValueToDouble(thematicalDiscussionsCell) : 0;
                    double consultasionsValue = consultasionsCell != null ? ConvertCellValueToDouble(consultasionsCell) : 0;
                    double examsValue = examsCell != null ? ConvertCellValueToDouble(examsCell) : 0;
                    double offsetsValue = offsetsCell != null ? ConvertCellValueToDouble(offsetsCell) : 0;
                    double othersValue = otherCell != null ? ConvertCellValueToDouble(otherCell) : 0;
                    double abstractsValue = abstractCell != null ? ConvertCellValueToDouble(abstractCell) : 0;
                    double esTestPapersValue = esTestPapersCell != null ? ConvertCellValueToDouble(esTestPapersCell) : 0;
                    double stateExamsValue = stateExamsCell != null ? ConvertCellValueToDouble(stateExamsCell) : 0;
                    double postgraduateExamsValue = postgraduateExamsCell != null ? ConvertCellValueToDouble(postgraduateExamsCell) : 0;
                    double practicesValue = practicesCell != null ? ConvertCellValueToDouble(practicesCell) : 0;
                    double departmentManagementsValue = departmentManagementCell != null ? ConvertCellValueToDouble(departmentManagementCell) : 0;
                    double studentResearchsValue = studentReserachWorkCell != null ? ConvertCellValueToDouble(studentReserachWorkCell) : 0;
                    double courseWorksValue = courseWorksCell != null ? ConvertCellValueToDouble(courseWorksCell) : 0;
                    double graduationQualificationManagementsValue = graduationQualificationManagementCell != null ? ConvertCellValueToDouble(graduationQualificationManagementCell) : 0;
                    double masterProgramManagementsValue = masterProgramManagementCell != null ? ConvertCellValueToDouble(masterProgramManagementCell) : 0;
                    double postgraduateProgramManagementsValue = postgraduateProgramManagementCell != null ? ConvertCellValueToDouble(postgraduateProgramManagementCell) : 0;

                    if (lectionsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = lectionsValue,
                            ProjectType = ProjectType.Lection
                        });
                    if (practicalLessonsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = practicalLessonsValue,
                            ProjectType = ProjectType.PracticalLesson
                        });
                    if (laboratoryLessonsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = laboratoryLessonsValue,
                            ProjectType = ProjectType.LaboratoryLesson
                        });
                    if (thematicalDiscussionsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = thematicalDiscussionsValue,
                            ProjectType = ProjectType.ThematicalDiscussion
                        });
                    if (consultasionsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = consultasionsValue,
                            ProjectType = ProjectType.Consultation
                        });
                    if (examsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = examsValue,
                            ProjectType = ProjectType.Exam
                        });
                    if (offsetsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = offsetsValue,
                            ProjectType = ProjectType.Offest
                        });
                    if (othersValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = othersValue,
                            ProjectType = ProjectType.Other
                        });
                    if (abstractsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = abstractsValue,
                            ProjectType = ProjectType.Abstract
                        });
                    if (esTestPapersValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = esTestPapersValue,
                            ProjectType = ProjectType.EsTestPapers
                        });
                    if (stateExamsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = stateExamsValue,
                            ProjectType = ProjectType.StateExam
                        });
                    if (postgraduateExamsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = postgraduateExamsValue,
                            ProjectType = ProjectType.PostgraduateEntranceExam
                        });
                    if (practicesValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = practicesValue,
                            ProjectType = ProjectType.Practice
                        });
                    if (departmentManagementsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = departmentManagementsValue,
                            ProjectType = ProjectType.DepartmentManagement
                        });
                    if (studentResearchsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = studentResearchsValue,
                            ProjectType = ProjectType.StudentResearchWork
                        });
                    if (courseWorksValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = courseWorksValue,
                            ProjectType = ProjectType.CourseWork
                        });
                    if (graduationQualificationManagementsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = graduationQualificationManagementsValue,
                            ProjectType = ProjectType.GraduationQualificationManagement
                        });
                    if (masterProgramManagementsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = masterProgramManagementsValue,
                            ProjectType = ProjectType.MasterProgramManagement
                        });
                    if (postgraduateProgramManagementsValue > 0)
                        studyLoad.Add(new StudyLoad
                        {
                            DisciplineTitle = title,
                            DisciplineTitleId = title.Id,
                            Faculty = faculty,
                            FacultyId = faculty.Id,
                            SemesterNumber = semesterNumber,
                            StudyWeeksCount = studyWeeksCount,
                            GroupsInTheStream = groups,
                            StudentGroup = group,
                            StudentGroupId = group.Id,
                            Value = postgraduateProgramManagementsValue,
                            ProjectType = ProjectType.PostgraduateProgramManagement
                        });
                }
                #endregion
            }
            departmentLoad.StudyLoad = studyLoad;
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

        private double ConvertCellValueToDouble(ICell cell)
        {
            if (cell.CellType == CellType.Numeric)
                return cell.NumericCellValue;

            string cellValue = cell.StringCellValue.Replace(',', '.');
            double result = Convert.ToDouble(new DataTable().Compute(cellValue, null));
            return result;
        }

        private FileStream PrepareFile(string fileName, Stream file, long? fileLength)
        {
            string folderName = "Upload";
            string contentRootPath = _hostingEnvironment.ContentRootPath;
            string newPath = Path.Combine(contentRootPath, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (fileLength > 0)
            {
                string sFileExtension = Path.GetExtension(fileName).ToLower();
                string fullPath = Path.Combine(newPath, fileName);
                var stream = new FileStream(fullPath, FileMode.Create);
                file.CopyTo(stream);
                stream.Position = 0;

                return stream;
            }

            return null;
        }

        private void RemoveFile(string fileName)
        {
            string folderName = "Upload";
            string contentRootPath = _hostingEnvironment.ContentRootPath;
            string filePath = Path.Combine(contentRootPath, folderName, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}