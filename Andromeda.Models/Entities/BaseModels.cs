using System.Collections.Generic;

namespace Andromeda.Models.Entities
{
    public abstract class BaseGetOptions
    {
        public int? Id { get; set; }
        public IReadOnlyList<int> Ids { get; set; }
    }
}