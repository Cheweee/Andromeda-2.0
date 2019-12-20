import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import { DepartmentLoad } from "../../models";

const styles = mergeStyles(commonStyles)

interface Props extends WithStyles<typeof styles> {
    departmentLoad: DepartmentLoad;
}

export const DepartmentLoadDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        departmentLoad
    } = props;
    return (
        <Grid container direction="column">
            <Grid container direction="row">
                <Typography>Учебный год:</Typography>
                <Typography variant="h4"> {departmentLoad.studyYears} </Typography>
            </Grid>
            <Grid container direction="row">
                <Typography>Всего нагрузки:</Typography>
                <Typography variant="h4"> {departmentLoad.totalLoad} </Typography>
                <Typography>ч.</Typography>
            </Grid>
        </Grid>
    )
});