using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005090003)]
    public class CreateCascadeRuleForDepartmentLoad : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.ForeignKey("FK_DepartmentLoad_DepartmentId_Department_Id")
                .OnTable("DepartmentLoad");

            Alter.Column("DepartmentId").OnTable("DepartmentLoad")
                .AsInt32()
                .NotNullable()
                .ForeignKey("Department", "Id")
                .OnDeleteOrUpdate(Rule.Cascade);
        }
    }
}