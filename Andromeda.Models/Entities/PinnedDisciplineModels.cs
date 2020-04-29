using System.Collections.Generic;
using Andromeda.Models.Enumerations;

namespace Andromeda.Models.Entities
{
    public class PinnedDiscipline
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DisciplineTitleId { get; set; }
        public ProjectType ProjectType { get; set; }

        public string DisciplineTitle { get; set; }
    }

    public class PinnedDisciplineGetOptions : BaseGetOptions
    {
        public int? UserId { get; set; }
        public IReadOnlyList<int> UsersIds { get; set; }
        public int? DisciplineTitleId { get; set; }
        public IReadOnlyList<int> DisciplineTitlesIds { get; set; }
    }
}