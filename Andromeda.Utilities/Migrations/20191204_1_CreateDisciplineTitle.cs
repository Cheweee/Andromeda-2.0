using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201912040001)]
    public class CreateDisciplineTitle : Migration
    {
        public override void Down()
        {
            Delete.Table("DisciplineTitle");
        }

        public override void Up()
        {
            Create.Table("DisciplineTitle")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("DepartmentId").AsInt32().ForeignKey("Department", "Id")
            .WithColumn("Shortname").AsString().NotNullable()
            .WithColumn("Name").AsString().NotNullable();
        }
    }
}