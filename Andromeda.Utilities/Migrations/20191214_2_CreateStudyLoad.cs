using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201912140002)]
    public class CreateStudyLoad : Migration
    {
        public override void Down()
        {
            Delete.Table("StudyLoad");
        }

        public override void Up()
        {
            Create.Table("StudyLoad")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("DepartmentLoadId").AsInt32().NotNullable().ForeignKey("DepartmentLoad", "Id")
                .WithColumn("DisciplineTitleId").AsInt32().NotNullable().ForeignKey("DisciplineTitle", "Id")
                .WithColumn("FacultyId").AsInt32().NotNullable().ForeignKey("Department", "Id")
                .WithColumn("StudentGroupId").AsInt32().NotNullable().ForeignKey("StudentGroup", "Id")
                .WithColumn("UserId").AsInt32().Nullable().ForeignKey("User", "Id")
                .WithColumn("SemesterNumber").AsInt32().NotNullable()
                .WithColumn("StudyWeeksCount").AsInt32().NotNullable()
                .WithColumn("GroupsInTheStream").AsInt32().NotNullable()
                .WithColumn("Value").AsDouble().NotNullable()
                .WithColumn("ProjectType").AsInt32().NotNullable();
        }
    }
}