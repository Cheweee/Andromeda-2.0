using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202001190004)]
    public class CreateUserLoad : Migration
    {
        public override void Down()
        {
            Delete.Table("UserLoad");
        }

        public override void Up()
        {
            Create.Table("UserLoad")
            .WithColumn("UserLoadId").AsInt32().PrimaryKey().Identity()
            .WithColumn("UserId").AsInt32().ForeignKey("User", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("StudyLoadId").AsInt32().ForeignKey("StudyLoad", "Id").OnDeleteOrUpdate(Rule.Cascade)
            .WithColumn("StudentsCount").AsInt32().Nullable();
        }
    }
}