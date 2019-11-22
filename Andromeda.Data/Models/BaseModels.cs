using System.Collections.Generic;

namespace Andromeda.Data.Models
{
    public abstract class BaseGetOptions
    {
        public int? Id { get; set; }
        public IReadOnlyList<int> Ids { get; set; }
    }
}