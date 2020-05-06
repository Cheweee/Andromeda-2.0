using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005070001)]
    public class CreateCascadeRuleForPinnedDiscipline : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.Column("DisciplineTitleId").FromTable("PinnedDiscipline");
            Create.Column("DisciplineTitleId").OnTable("PinnedDiscipline")
                .AsInt32()
                .NotNullable()
                .ForeignKey("DisciplineTitle", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}