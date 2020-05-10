using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005100001)]
    public class DeleteFK_GroupDisciplineLoad_Department : Migration
    {
        public override void Down()
        {
            Delete.Column("FacultyName").FromTable("GroupDisciplineLoad");

            Create.Column("FacultyId")
                  .OnTable("GroupDisciplineLoad")
                  .AsInt32()
                  .NotNullable();
        }

        public override void Up()
        {
            Create.Column("FacultyName")
                  .OnTable("GroupDisciplineLoad")
                  .AsString()
                  .NotNullable()
                  .WithDefaultValue("");

            Execute.Sql(@"
                update [GroupDisciplineLoad] set 
                	[FacultyName] = f.Name
                from [GroupDisciplineLoad] gdl 
                join [Department] f on gdl.FacultyId = f.Id and f.[Type] = 0
            ");

            Delete.ForeignKey("FK_GroupDisciplineLoad_Department").OnTable("GroupDisciplineLoad");

            Delete.Column("FacultyId").FromTable("GroupDisciplineLoad");
        }
    }
}