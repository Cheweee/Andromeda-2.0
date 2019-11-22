using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201911060002)]
    public class CreateRoleInDepartment : Migration
    {
        public override void Down()
        {
            Delete.Table("RoleInDepartment");
            Delete.Table("UserRoleInDepartment");
        }

        public override void Up()
        {
            Create.Table("RoleInDepartment")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("RoleId").AsInt32().ForeignKey("Role", "Id").OnDelete(Rule.Cascade)
                .WithColumn("DepartmentId").AsInt32().ForeignKey("Department", "Id").OnDelete(Rule.Cascade);

            Create.Table("UserRoleInDepartment")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("RoleInDepartmentId").AsInt32().ForeignKey("RoleInDepartment", "Id").OnDelete(Rule.Cascade)
                .WithColumn("UserId").AsInt32().ForeignKey("User", "Id").OnDelete(Rule.Cascade);
        }
    }
}