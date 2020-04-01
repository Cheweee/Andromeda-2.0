import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import { DepartmentLoad } from "../../models";

const styles = mergeStyles(commonStyles)

interface Props extends WithStyles<typeof styles> {
    studyYear: string;
    totalLoad: number;
}

export const DepartmentLoadDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        studyYear,
        totalLoad
    } = props;
    return (
        <Grid container direction="column">
            <Typography variant="h6">Учебный год: {studyYear}</Typography>
            <Typography variant="h6">Всего нагрузки: {totalLoad.toFixed(2)}ч.</Typography>
        </Grid>
    )
});