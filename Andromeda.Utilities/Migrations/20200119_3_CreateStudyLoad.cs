using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202001190003)]
    public class CreateStudyLoad : Migration
    {
        public override void Down()
        {
            Delete.Table("StudyLoad");
        }

        public override void Up()
        {
            Create.Table("StudyLoad")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("GroupDisciplineLoadId").AsInt32().NotNullable().ForeignKey("GroupDisciplineLoad", "Id").OnDeleteOrUpdate(Rule.Cascade)
                .WithColumn("ShownValue").AsString().NotNullable()
                .WithColumn("Value").AsDouble().NotNullable()
                .WithColumn("ProjectType").AsInt32().NotNullable();
        }
    }
}