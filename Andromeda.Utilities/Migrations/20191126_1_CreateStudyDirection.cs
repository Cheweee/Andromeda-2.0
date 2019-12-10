using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201911260001)]
    public class CreateStudyDirection : Migration
    {
        public override void Down()
        {
            Delete.Table("StudyDirection");
            Delete.Column("StudyDirectionId").FromTable("StudentGroup");
            Create.Column("StudyDirection").OnTable("StudentGroup").AsString().NotNullable();
        }

        public override void Up()
        {
            Create.Table("StudyDirection")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("DepartmentId").AsInt32().ForeignKey("Department", "Id")
                .WithColumn("Code").AsString().NotNullable()
                .WithColumn("Name").AsString().NotNullable()
                .WithColumn("ShortName").AsString().NotNullable();

            Delete.Column("StudyDirection").FromTable("StudentGroup");
            Create.Column("StudyDirectionId").OnTable("StudentGroup").AsInt32().NotNullable().ForeignKey("StudyDirection", "Id").OnDelete(Rule.None);
        }
    }
}