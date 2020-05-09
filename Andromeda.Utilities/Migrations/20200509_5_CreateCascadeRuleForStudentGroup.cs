using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005090005)]
    public class CreateCascadeRuleForStudentGroup : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.ForeignKey("FK_StudentGroup_StudyDirectionId_StudyDirection_Id")
                .OnTable("StudentGroup");

            Alter.Column("StudyDirectionId").OnTable("StudentGroup")
                .AsInt32()
                .NotNullable()
                .ForeignKey("StudyDirection", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}