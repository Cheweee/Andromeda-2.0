using System.Data;
using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(202005090002)]
    public class DeleteDepartmentForeignKeyForStudentGroups : ForwardOnlyMigration
    {
        public override void Up()
        {
            Delete.Column("DepartmentId").FromTable("StudentGroup");
        }
    }
}