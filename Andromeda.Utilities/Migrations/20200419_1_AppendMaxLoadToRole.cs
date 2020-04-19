using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202004190001)]
    public class AddMaxLoadToRole : Migration
    {
        public override void Down()
        {
            Delete.Column("CanTeach")
            .Column("MinLoad")
            .Column("MaxLoad")
            .FromTable("Role");
        }

        public override void Up()
        {
            Create.Column("CanTeach").OnTable("Role").AsBoolean().NotNullable().WithDefaultValue(false);
            Create.Column("MinLoad").OnTable("Role").AsDouble().Nullable();
            Create.Column("MaxLoad").OnTable("Role").AsDouble().Nullable();
        }
    }
}