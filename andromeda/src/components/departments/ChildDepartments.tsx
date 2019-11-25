import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Department, DepartmentType } from "../../models";
import { List, ListItem, ListItemText, Grid, Typography } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    departmentType: DepartmentType;
    childDepartments: Department[];
}

export const ChildDepartments = withStyles(styles)(function (props: Props) {
    const {
        departmentType,
        childDepartments
    } = props;


    let emptyDepartmentUsersMessage = '';
    switch (departmentType) {
        case DepartmentType.Faculty:
            emptyDepartmentUsersMessage = 'У данного факультета еще нет кафедр';
            break;
        default:
            emptyDepartmentUsersMessage = 'У данного подразделения еще нет дочерних подразделений';
            break;
    }

    if (!childDepartments.length) {
        return (
            <Grid container direction="row" justify="center">
                <Typography color="textSecondary">{emptyDepartmentUsersMessage}</Typography>
            </Grid>
        );
    }
    return (
        <List>
            {childDepartments.map(department => (
                <ListItem>
                    <ListItemText
                        key={department.id}
                        primary={department.fullName}
                    />
                </ListItem>
            ))}
        </List>
    );
});