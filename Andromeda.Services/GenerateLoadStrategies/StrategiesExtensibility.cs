using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public interface IGenerateDepartmentLoad
    {
        Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model);
    }

    public interface IGenerateStrategy
    {
        Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model, List<GenerateRatio> generateRatios);
    }

    public static class GenerateStrategyExtensions
    {
        public static async Task<DepartmentLoad> GenerateExtensions(this IEnumerable<IGenerateStrategy> members, DepartmentLoadGenerateOptions options, DepartmentLoad model)
        {
            List<GenerateRatio> generateRatios = new List<GenerateRatio>();

            var membersList = members.ToList();
            if (membersList != null)
            {
                for (int i = 0; i < membersList.Count; i++)
                    model = await membersList[i].Generate(options, model, generateRatios);
            }
            else
            {
                foreach (var member in members)
                    model = await member.Generate(options, model, generateRatios);
            }

            return model;
        }
    }

    public class GenerateCompositeStrategy : IGenerateDepartmentLoad
    {
        private readonly Func<IEnumerable<IGenerateStrategy>> _membersFactory;

        public GenerateCompositeStrategy(Func<IEnumerable<IGenerateStrategy>> membersFactory)
        {
            _membersFactory = membersFactory ?? throw new System.ArgumentNullException(nameof(membersFactory));
        }

        public async Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model)
        {
            return await _membersFactory().GenerateExtensions(options, model);
        }
    }
}