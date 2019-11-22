using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201911060001)]
    public class CreateRole : Migration
    {
        public override void Down()
        {
            Delete.Table("Role");
        }

        public override void Up()
        {
            Create.Table("Role")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Name").AsString().NotNullable()
                .WithColumn("DateCreated").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime)
                .WithColumn("DateUpdated").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime);
        }
    }
}