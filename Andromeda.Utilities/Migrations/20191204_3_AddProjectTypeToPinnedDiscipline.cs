using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201912040003)]
    public class AddProjectTypeToPinnedDiscipline : Migration
    {
        public override void Down()
        {
            Delete.Column("ProjectType").FromTable("PinnedDiscipline");
        }

        public override void Up()
        {
            Create.Column("ProjectType").OnTable("PinnedDiscipline").AsInt32().NotNullable();
        }
    }
}