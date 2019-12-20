using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Services.GenerateLoadStrategies;

namespace Andromeda.Services
{
    public class DepartmentLoadService
    {
        private readonly IDepartmentLoadDao _dao;
        private readonly StudyLoadService _studyLoadService;
        private readonly IGenerateStrategy _generateStrategy;

        public DepartmentLoadService(
            IDepartmentLoadDao dao,
            StudyLoadService studyLoadService,
            IGenerateStrategy generateStrategy
        )
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
            _studyLoadService = studyLoadService ?? throw new ArgumentException(nameof(studyLoadService));
            _generateStrategy = generateStrategy ?? throw new ArgumentException(nameof(generateStrategy));
        }

        public async Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options) => await _dao.Get(options);

        public async Task<DepartmentLoad> Create(DepartmentLoad model)
        {
            await _dao.Create(model);

            if(model.StudyLoad != null)
            {
                await UpdateStudyLoad(model.Id, model.StudyLoad);
            }
            return model;
        }

        public async Task<DepartmentLoad> Update(DepartmentLoad model)
        {
            await _dao.Update(model);

            if(model.StudyLoad != null)
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
    }
}