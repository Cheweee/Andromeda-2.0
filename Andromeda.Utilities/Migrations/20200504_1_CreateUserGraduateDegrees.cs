using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005040001)]
    public class CreateUserGraduateDegrees : Migration
    {
        public override void Down()
        {
            Delete.Table("UserGraduateDegree");
        }

        public override void Up()
        {
            Create.Table("UserGraduateDegree")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("UserId").AsInt32().NotNullable().ForeignKey("User", "Id")
            .WithColumn("GraduateDegree").AsInt32().NotNullable()
            .WithColumn("BranchOfScience").AsInt32().NotNullable();
        }
    }
}