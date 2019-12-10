using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201912040002)]
    public class CreatePinnedDiscipline : Migration
    {
        public override void Down()
        {
            Delete.Table("PinnedDiscipline");
        }

        public override void Up()
        {
            Create.Table("PinnedDiscipline")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("UserId").AsInt32().NotNullable().ForeignKey("User", "Id")
            .WithColumn("DisciplineTitleId").AsInt32().NotNullable().ForeignKey("DisciplineTitle", "Id");
        }
    }
}