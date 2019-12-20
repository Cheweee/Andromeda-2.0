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

        public StudyLoadService(IStudyLoadDao dao, StudentGroupService studentGroupService)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _studentGroupService = studentGroupService ?? throw new ArgumentNullException(nameof(studentGroupService));
        }

        public async Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options)
        {
            var studyLoad = await _dao.Get(options);

            var studyLoadIds = studyLoad.Select(o => o.Id).ToList();
            var studentGroups = await _studentGroupService.Get(new StudentGroupGetOptions { Ids = studyLoadIds });
            // studyLoad = studyLoad.GroupJoin(studentGroups, sl => sl.Id, sg => sg.StudyLoadId, (sl, sg) => {
            //     sl.Groups = sg;
            //     return sl;
            // });

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