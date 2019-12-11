import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Department, DepartmentType, RoleInDepartment } from "../../../models";
import { ListItem, ListItemText, ListSubheader, List, Grid, Typography } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    departments: RoleInDepartment[];
}

export const RoleDepartments = withStyles(styles)(function (props: Props) {
    const {
        departments,
    } = props;

    const emptyRoleDepartmentsMessage = "Данная роль еще не используется подразделениями";

    const faculties = departments.filter(o => o.departmentType === DepartmentType.Faculty);
    const trainingDepartments = departments.filter(o => o.departmentType === DepartmentType.TrainingDepartment);
    const facultiesListItems = faculties.map((department, index) => {
        return (
            <ListItem key={index}>
                <ListItemText key={department.id} primary={department.departmentName} />
            </ListItem>
        );
    });
    const trainingDepartmentListItems = trainingDepartments.map((department, index) => {
        return (
            <ListItem key={index}>
                <ListItemText key={department.id} primary={department.departmentName} />
            </ListItem>
        );
    });

    return (
        <Grid container direction="column">
            {departments.length ? (
                <List >
                    {faculties.length && (
                        <div>
                            <ListSubheader>Факультеты и институты</ListSubheader>
                            {facultiesListItems}
                        </div>
                    )}
                    {trainingDepartments.length && (
                        <div>
                            <ListSubheader>Кафедры</ListSubheader>
                            {trainingDepartmentListItems}
                        </div>
                    )}
                </List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{emptyRoleDepartmentsMessage}</Typography>
                    </Grid>
                )
            }
        </Grid >
    );
});