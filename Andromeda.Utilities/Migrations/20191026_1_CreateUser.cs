using FluentMigrator;

namespace Andromeda.Utilities.Migrations
{
    [Migration(201910260001)]
    public class CreateUser : Migration
    {
        public override void Down()
        {
            Delete.Table("User");
        }

        public override void Up()
        {
            Create.Table("User")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Username").AsString().NotNullable()
                .WithColumn("Firstname").AsString().NotNullable()
                .WithColumn("Secondname").AsString().Nullable()
                .WithColumn("Lastname").AsString().NotNullable()
                .WithColumn("Email").AsString().NotNullable()
                .WithColumn("PasswordHash").AsBinary().NotNullable()
                .WithColumn("DateCreated").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime)
                .WithColumn("DateUpdated").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime);

            Execute.Sql(@"
                insert into [User] (
                    Username,
                    Firstname,
                    Lastname,
                    Email,
                    PasswordHash
                ) values (
                    'admin',
                    'Кирилл',
                    'Иванченко',
                    'kni2012.15@gmail.com',
                    pwdencrypt('admin')
                )
            ");
        }
    }
}