using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005090001)]
    public class CreateCascadeRuleForGroupDisciplineLoad : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.ForeignKey("FK_GroupDisciplineLoad_StudentGroupId_StudentGroup_Id")
                .OnTable("GroupDisciplineLoad");

            Alter.Column("StudentGroupId").OnTable("GroupDisciplineLoad")
                .AsInt32()
                .NotNullable()
                .ForeignKey("StudentGroup", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}