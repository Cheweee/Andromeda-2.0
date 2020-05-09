using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005070001)]
    public class CreateCascadeRuleForPinnedDiscipline : ForwardOnlyMigration
    {
        public override void Up()
        {
             Delete.ForeignKey("FK_PinnedDiscipline_DisciplineTitleId_DisciplineTitle_Id")
                 .OnTable("PinnedDiscipline");

            Alter.Column("DisciplineTitleId").OnTable("PinnedDiscipline")
                .AsInt32()
                .NotNullable()
                .ForeignKey("DisciplineTitle", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}