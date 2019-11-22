using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201910260002)]
    public class CreateDepartment : Migration
    {
        public override void Down()
        {
            Delete.Table("Department");
        }

        public override void Up()
        {
            Create.Table("Department")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Name").AsString().NotNullable()
                .WithColumn("FullName").AsString().NotNullable()
                .WithColumn("Type").AsInt32().NotNullable()
                .WithColumn("ParentId").AsInt32().Nullable();
        }
    }
}