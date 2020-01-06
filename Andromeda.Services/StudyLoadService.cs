using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;

namespace Andromeda.Services
{
    public class StudyLoadService
    {
        private readonly IStudyLoadDao _dao;
        private readonly StudentGroupService _studentGroupService;
        private readonly DepartmentService _departmentService;
        private readonly UserService _userService;
        private readonly DisciplineTitleService _disciplineTitleService;

        public StudyLoadService(
            IStudyLoadDao dao,
            StudentGroupService studentGroupService,
            DepartmentService departmentService,
            UserService userService,
            DisciplineTitleService disciplineTitleService)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _studentGroupService = studentGroupService ?? throw new ArgumentNullException(nameof(studentGroupService));
            _departmentService = departmentService ?? throw new ArgumentNullException(nameof(departmentService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _disciplineTitleService = disciplineTitleService ?? throw new ArgumentNullException(nameof(disciplineTitleService));
        }

        public async Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options)
        {
            var studyLoad = await _dao.Get(options);

            var studyLoadIds = studyLoad.Select(o => o.Id).ToList();
            var studentGroups = await _studentGroupService.Get(new StudentGroupGetOptions { Ids = studyLoadIds });
            

            return studyLoad;
        }

        public async Task<List<StudyLoad>> Create(List<StudyLoad> model)
        {
            await _dao.Create(model);

            return model;
        }

        public async Task<List<StudyLoad>> Update(List<StudyLoad> model)
        {
            await _dao.Update(model);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }
    }
}