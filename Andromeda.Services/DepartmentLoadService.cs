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

namespace Andromeda.Services
{
    public class DepartmentLoadService
    {
        private readonly IDepartmentLoadDao _dao;
        private readonly DepartmentService _departmentService;
        private readonly DisciplineTitleService _disciplineTitleService;
        private readonly StudentGroupService _studentGroupService;
        private readonly StudyLoadService _studyLoadService;

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

            _generateStrategy = generateStrategy ?? throw new ArgumentException(nameof(generateStrategy));

            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentException(nameof(hostingEnvironment));
            _logger = logger ?? throw new ArgumentException(nameof(logger));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentException(nameof(httpContextAccessor));
        }

        public async Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options) {
            var loads = await _dao.Get(options);
            var loadsIds = loads.Select(o=> o.Id).ToList();

            var studyLoad = await _studyLoadService.Get(new StudyLoadGetOptions {
                DepartmentLoadsIds = loadsIds
            });

            foreach(var load in loads)
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
                List<string> disciplinesTitles = new List<string>();
                List<int> semesters = new List<int>();
                List<string> studyDirections = new List<string>();
                List<string> faculties = new List<string>();
                List<int> courses = new List<int>();
                List<string> studentGroups = new List<string>();
                List<int> studentsCount = new List<int>();
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
                    await GetLoadFromSheet(
                        departmentLoad,
                        loadSheet,
                        disciplinesTitles,
                        semesters,
                        studyDirections,
                        faculties,
                        courses,
                        studentGroups,
                        studentsCount
                    );
                }

                if (options.UpdateDisciplinesTitles)
                {
                    var titles = new List<DisciplineTitle>();
                    var uniqueTitles = disciplinesTitles.Distinct();
                    foreach (var title in uniqueTitles)
                    {
                        titles.Add(new DisciplineTitle
                        {
                            DepartmentId = options.DepartmentId.Value,
                            Name = title,
                            Shortname = title.GetShortening()
                        });
                    }

                    await _departmentService.UpdateDepartmentDisciplinesTitles(options.DepartmentId.Value, titles);
                }

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

        private async Task GetLoadFromSheet(
            DepartmentLoad departmentLoad,
            ISheet loadSheet,
            List<string> disciplinesTitles,
            List<int> semesters,
            List<string> studyDirections,
            List<string> faculties,
            List<int> courses,
            List<string> studentGroups,
            List<int> studentsCount
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
                disciplinesTitles.Add(disciplineTitleCell.StringCellValue);
                semesters.Add(Convert.ToInt32(semesterCell.NumericCellValue));
                studyDirections.Add(studyDirectionCell.StringCellValue);
                faculties.Add(facultyCell.StringCellValue);
                courses.Add(Convert.ToInt32(courseCell.NumericCellValue));
                studentGroups.Add(studentGroupCell.StringCellValue);
                studentsCount.Add(Convert.ToInt32(studentsCountCell.NumericCellValue));
                groupsInTheStream.Add(Convert.ToInt32(groupsInStreamCell.NumericCellValue));
                studyWeeks.Add(Convert.ToInt32(studyWeeksCell.NumericCellValue));

                lections.Add(lectionsCell != null ? ConvertCellValueToDouble(lectionsCell) : 0);
                practicalLessons.Add(practicalLessonsCell != null ? ConvertCellValueToDouble(practicalLessonsCell) : 0);
                laboratoryLessons.Add(laboratoryLessonsCell != null ? ConvertCellValueToDouble(laboratoryLessonsCell) : 0);
                thematicalDiscussions.Add(thematicalDiscussionsCell != null ? ConvertCellValueToDouble(thematicalDiscussionsCell) : 0);
                consultasions.Add(consultasionsCell != null ? ConvertCellValueToDouble(consultasionsCell) : 0);
                exams.Add(examsCell != null ? ConvertCellValueToDouble(examsCell) : 0);
                offsets.Add(offsetsCell != null ? ConvertCellValueToDouble(offsetsCell) : 0);
                others.Add(otherCell != null ? ConvertCellValueToDouble(otherCell) : 0);
                abstracts.Add(abstractCell != null ? ConvertCellValueToDouble(abstractCell) : 0);
                esTestPapers.Add(esTestPapersCell != null ? ConvertCellValueToDouble(esTestPapersCell) : 0);
                stateExams.Add(stateExamsCell != null ? ConvertCellValueToDouble(stateExamsCell) : 0);
                postgraduateExams.Add(postgraduateExamsCell != null ? ConvertCellValueToDouble(postgraduateExamsCell) : 0);
                practices.Add(practicesCell != null ? ConvertCellValueToDouble(practicesCell) : 0);
                departmentManagements.Add(departmentManagementCell != null ? ConvertCellValueToDouble(departmentManagementCell) : 0);
                studentResearchs.Add(studentReserachWorkCell != null ? ConvertCellValueToDouble(studentReserachWorkCell) : 0);
                courseWorks.Add(courseWorksCell != null ? ConvertCellValueToDouble(courseWorksCell) : 0);
                graduationQualificationManagements.Add(graduationQualificationManagementCell != null ? ConvertCellValueToDouble(graduationQualificationManagementCell) : 0);
                masterProgramManagements.Add(masterProgramManagementCell != null ? ConvertCellValueToDouble(masterProgramManagementCell) : 0);
                postgraduateProgramManagements.Add(postgraduateProgramManagementCell != null ? ConvertCellValueToDouble(postgraduateProgramManagementCell) : 0);
                #endregion
            }

            var disciplinesTitlesList = await _disciplineTitleService.Get(new DisciplineTitleGetOptions
            {
                Titles = disciplinesTitles.Distinct().ToList()
            });

            var studentGroupsList = await _studentGroupService.Get(new StudentGroupGetOptions
            {
                Names = studentGroups.Distinct().ToList()
            });

            var facultiesList = await _departmentService.Get(new DepartmentGetOptions
            {
                Type = DepartmentType.Faculty,
                Names = faculties.Distinct().ToList()
            });

            List<StudyLoad> studyLoad = new List<StudyLoad>();
            StudyLoadFormation(
                studyLoad,
                disciplinesTitlesList,
                studentGroupsList,
                facultiesList,
                disciplinesTitles,
                semesters,
                studyDirections,
                faculties,
                courses,
                studentGroups,
                studentsCount,
                groupsInTheStream,
                studyWeeks,
                lections,
                practicalLessons,
                laboratoryLessons,
                thematicalDiscussions,
                consultasions,
                exams,
                offsets,
                others,
                abstracts,
                esTestPapers,
                stateExams,
                postgraduateExams,
                practices,
                departmentManagements,
                studentResearchs,
                courseWorks,
                graduationQualificationManagements,
                masterProgramManagements,
                postgraduateProgramManagements
            );

            departmentLoad.StudyLoad = studyLoad;
        }

        private void StudyLoadFormation(
            List<StudyLoad> departmentLoad,
            IEnumerable<DisciplineTitle> disciplineTitlesList,
            IEnumerable<StudentGroup> studentGroupsList,
            IEnumerable<Department> facultiesList,
            List<string> disciplinesTitles,
            List<int> semesters,
            List<string> studyDirections,
            List<string> faculties,
            List<int> courses,
            List<string> studentGroups,
            List<int> studentsCount,
            List<int> groupsInTheStream,
            List<int> studyWeeks,
            List<double> lections,
            List<double> practicalLessons,
            List<double> laboratoryLessons,
            List<double> thematicalDiscussions,
            List<double> consultasions,
            List<double> exams,
            List<double> offsets,
            List<double> others,
            List<double> abstracts,
            List<double> esTestPapers,
            List<double> stateExams,
            List<double> postgraduateExams,
            List<double> practices,
            List<double> departmentManagements,
            List<double> studentResearchs,
            List<double> courseWorks,
            List<double> graduationQualificationManagements,
            List<double> masterProgramManagements,
            List<double> postgraduateProgramManagements
        )
        {
            for (int i = 0; i < disciplinesTitles.Count; i++)
            {
                var title = disciplineTitlesList.FirstOrDefault(o => o.Name == disciplinesTitles[i]);
                if (title == null)
                {
                    _logger.LogWarning($"Наименование дисциплины (\"{disciplinesTitles[i]}\") не найдено, поэтому нагрузка будет пропущена.");
                    continue;
                }
                var faculty = facultiesList.FirstOrDefault(o => o.Name == faculties[i]);
                if (faculty == null)
                {
                    _logger.LogWarning($"Факультет (\"{faculties[i]}\") не найден, поэтому нагрузка будет пропущена.");
                    continue;
                }
                int semesterNumber = semesters[i];
                int studyWeeksCount = studyWeeks[i];
                int groups = groupsInTheStream[i];
                var group = studentGroupsList.FirstOrDefault(o => o.Name == studentGroups[i]);
                if (group == null)
                {
                    _logger.LogWarning($"Группа (\"{studentGroups[i]}\") не найдена, поэтому нагрузка будет пропущена.");
                    continue;
                }

                double lectionsValue = lections[i];
                double practicalLessonsValue = practicalLessons[i];
                double laboratoryLessonsValue = laboratoryLessons[i];
                double thematicalDiscussionsValue = thematicalDiscussions[i];
                double consultasionsValue = consultasions[i];
                double examsValue = exams[i];
                double offsetsValue = offsets[i];
                double othersValue = others[i];
                double abstractsValue = abstracts[i];
                double esTestPapersValue = esTestPapers[i];
                double stateExamsValue = stateExams[i];
                double postgraduateExamsValue = postgraduateExams[i];
                double practicesValue = practices[i];
                double departmentManagementsValue = departmentManagements[i];
                double studentResearchsValue = studentResearchs[i];
                double courseWorksValue = courseWorks[i];
                double graduationQualificationManagementsValue = graduationQualificationManagements[i];
                double masterProgramManagementsValue = masterProgramManagements[i];
                double postgraduateProgramManagementsValue = postgraduateProgramManagements[i];

                if (lectionsValue > 0)
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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
                    departmentLoad.Add(new StudyLoad
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