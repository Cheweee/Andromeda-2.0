using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005090004)]
    public class CreateCascadeRuleForStudyDirection : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.ForeignKey("FK_StudyDirection_DepartmentId_Department_Id")
                .OnTable("StudyDirection");

            Alter.Column("DepartmentId").OnTable("StudyDirection")
                .AsInt32()
                .NotNullable()
                .ForeignKey("Department", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}