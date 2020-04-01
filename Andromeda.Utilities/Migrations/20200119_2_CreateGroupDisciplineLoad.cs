using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202001190002)]
    public class CreateGroupDisciplineLoad : Migration
    {
        public override void Down()
        {
            Delete.Table("GroupDisciplineLoad");
        }

        public override void Up()
        {
            Create.Table("GroupDisciplineLoad")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("DepartmentLoadId").AsInt32().ForeignKey("DepartmentLoad", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("DisciplineTitleId").AsInt32().ForeignKey("DisciplineTitle", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("StudentGroupId").AsInt32().ForeignKey("StudentGroup", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("FacultyId").AsInt32().ForeignKey("Department", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("SemesterNumber").AsInt32().NotNullable()
            .WithColumn("StudyWeeksCount").AsInt32().NotNullable()
            .WithColumn("Amount").AsDouble().NotNullable();
        }
    }
}