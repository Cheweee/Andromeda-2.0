using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public interface IGenerateStrategy
    {
        Task<DepartmentLoad> Generate(DepartmentLoad model);
    }

    public static class GenerateStrategyExtensions
    {
        public static async Task<DepartmentLoad> GenerateExtensions(this IEnumerable<IGenerateStrategy> members, DepartmentLoad model)
        {
            var membersList = members.ToList();
            if (membersList != null)
            {
                for (int i = 0; i < membersList.Count; i++)
                    model = await membersList[i].Generate(model);
            }
            else
            {
                foreach (var member in members)
                    model = await member.Generate(model);
            }

            return model;
        }
    }

    public class GenerateCompositeStrategy : IGenerateStrategy
    {
        private readonly Func<IEnumerable<IGenerateStrategy>> _membersFactory;

        public GenerateCompositeStrategy(Func<IEnumerable<IGenerateStrategy>> membersFactory)
        {
            _membersFactory = membersFactory ?? throw new System.ArgumentNullException(nameof(membersFactory));
        }

        public async Task<DepartmentLoad> Generate(DepartmentLoad model)
        {
            return await _membersFactory().GenerateExtensions(model);
        }
    }
}