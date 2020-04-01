import * as React from "react";

import { commonStyles } from "../../../muiTheme";
import { mergeStyles } from "../../../utilities";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, List, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { DepartmentType, UserRoleInDepartment, RoleInDepartment } from "../../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    departmentType: DepartmentType;
    departmentUsers: UserRoleInDepartment[],
    departmentRoles: RoleInDepartment[],
    handleUserRolesEdit: (userId: number) => void;
    handleUserRolesDelete: (userId: number) => void;
}

export const UsersRolesInDepartment = withStyles(styles)(function (props: Props) {
    const {
        departmentType,
        departmentUsers,
        departmentRoles,
        handleUserRolesEdit,
        handleUserRolesDelete
    } = props;

    let emptyDepartmentUsersMessage = '';
    switch (departmentType) {
        case DepartmentType.Faculty:
            emptyDepartmentUsersMessage = 'У данного факультета еще нет сотрудников';
            break;
        case DepartmentType.TrainingDepartment:
            emptyDepartmentUsersMessage = 'У данной кафедры еще нет сотрудников';
            break;
        default:
            emptyDepartmentUsersMessage = 'У данного подразделения еще нет сотрудников';
            break;
    }

    const usersDictionary = [];
    for (const user of departmentUsers) {
        if (usersDictionary.find(o => o.userName === user.userFullName))
            continue;

        const roleIds = departmentUsers.filter(o => o.userId === user.userId).map(o => o.roleId);

        const newUser = {
            userId: user.userId,
            userName: user.userFullName,
            roleIds: roleIds
        };
        usersDictionary.push(newUser);
    }

    for (const user of usersDictionary) {
        if (user.roleIds) {
            const roleNames = departmentRoles
                .filter(o => user.roleIds.includes(o.roleId))
                .map(o => o.roleName)
                .reduce((previous: string, current: string) => (previous ? (previous + '; ') : '') + current, '');
            user.roleNames = roleNames;
        }
    }

    const listItems = usersDictionary.map(user => {
        return (
            <ListItem key={user.userId}>
                <ListItemText primary={user.userName} secondary={user.roleNames} />
                <ListItemSecondaryAction>
                    <Grid container direction="row">
                        <IconButton onClick={() => handleUserRolesEdit(user.userId)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleUserRolesDelete(user.userId)}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
        )
    });

    return (
        <Grid container direction="column">
            {departmentUsers.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{emptyDepartmentUsersMessage}</Typography>
                    </Grid>
                )
            }
        </Grid>
    );
});