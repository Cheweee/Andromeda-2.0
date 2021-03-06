import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText, ListSubheader, List, Grid, Typography } from "@material-ui/core";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";

import { DepartmentType, RoleInDepartment } from "../../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    departments: RoleInDepartment[];
}

export const RoleDepartments = withStyles(styles)(function (props: Props) {
    const {
        departments,
        classes
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
            {Boolean(departments.length) ? (
                <List className={classes.backgroundPaper} subheader={<li />}>
                    {Boolean(faculties.length) && <li key={`section-${DepartmentType.Faculty}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ListSubheader>Факультеты и институты</ListSubheader>
                            {facultiesListItems}
                        </ul>
                    </li>
                    }
                    {Boolean(trainingDepartments.length) && <li key={`section-${DepartmentType.TrainingDepartment}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ListSubheader>Кафедры</ListSubheader>
                            {trainingDepartmentListItems}
                        </ul>
                    </li>
                    }
                </List>
            ) : (
                    <Grid container direction="row" alignItems="center" justify="center">
                        <Typography color="textSecondary">{emptyRoleDepartmentsMessage}</Typography>
                    </Grid>
                )
            }
        </Grid >
    );
});