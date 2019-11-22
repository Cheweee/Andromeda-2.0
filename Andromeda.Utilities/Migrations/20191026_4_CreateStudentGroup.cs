using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201910260004)]
    public class CreateStudentGroup : Migration
    {
        public override void Down()
        {
            Delete.Table("StudentGroup");
        }

        public override void Up()
        {
            Create.Table("StudentGroup")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("StudyDirection").AsString().NotNullable()
                .WithColumn("Name").AsString().NotNullable()
                .WithColumn("StudentsCount").AsInt32().NotNullable()
                .WithColumn("StartYear").AsInt32().NotNullable()
                .WithColumn("CurrentCourse").AsInt32().NotNullable()
                .WithColumn("DepartmentId").AsInt32().NotNullable().ForeignKey("Department", "Id")
                .WithColumn("StudyLoadId").AsInt32().Nullable().ForeignKey("StudyLoad", "Id");
        }
    }
}