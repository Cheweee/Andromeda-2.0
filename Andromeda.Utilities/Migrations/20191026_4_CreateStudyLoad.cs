using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201910260004)]
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
                .WithColumn("FacultyId").AsInt32().NotNullable().ForeignKey("Department", "Id")
                .WithColumn("StudentGroupId").AsInt32().NotNullable().ForeignKey("StudentGroup", "Id")
                .WithColumn("SubjectName").AsString().NotNullable()
                .WithColumn("SemesterNumber").AsInt32().NotNullable()
                .WithColumn("StudyWeeksCount").AsInt32().NotNullable()
                .WithColumn("Lections").AsInt32().Nullable()
                .WithColumn("PracticalWorks").AsInt32().Nullable()
                .WithColumn("LaboratoryWorks").AsInt32().Nullable()
                .WithColumn("TemathicalDiscussions").AsInt32().Nullable()
                .WithColumn("Consultations").AsInt32().Nullable()
                .WithColumn("Exams").AsInt32().Nullable()
                .WithColumn("Offests").AsInt32().Nullable()
                .WithColumn("ControlWorks").AsInt32().Nullable()
                .WithColumn("Abstrats").AsInt32().Nullable()
                .WithColumn("ESControlWorks").AsInt32().Nullable()
                .WithColumn("StateExams").AsInt32().Nullable()
                .WithColumn("PSEntryExams").AsInt32().Nullable()
                .WithColumn("Practices").AsInt32().Nullable()
                .WithColumn("DepartmentManagement").AsInt32().Nullable()
                .WithColumn("ResearchWorks").AsInt32().Nullable()
                .WithColumn("CourseWorks").AsInt32().Nullable()
                .WithColumn("GraduationWorkManagement").AsInt32().Nullable()
                .WithColumn("MasterProgramManagement").AsInt32().Nullable()
                .WithColumn("UndergraduateProgramManagement").AsInt32().Nullable();
        }
    }
}