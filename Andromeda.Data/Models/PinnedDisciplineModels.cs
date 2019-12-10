using System.Collections.Generic;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data.Models
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