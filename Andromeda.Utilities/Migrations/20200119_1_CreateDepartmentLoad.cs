using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202001190001)]
    public class CreateDepartmentLoad : Migration
    {
        public override void Down()
        {
            Delete.Table("DepartmentLoad");
        }

        public override void Up()
        {
            Create.Table("DepartmentLoad")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("DepartmentId").AsInt32().NotNullable().ForeignKey("Department", "Id")
            .WithColumn("StudyYear").AsString().NotNullable()
            .WithColumn("Total").AsDouble().NotNullable();
        }
    }
}