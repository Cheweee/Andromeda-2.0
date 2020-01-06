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
            <Typography variant="h6">Учебный год: {departmentLoad.studyYear}</Typography>
            <Typography variant="h6">Всего нагрузки: {departmentLoad.totalLoad}ч.</Typography>
        </Grid>
    )
});