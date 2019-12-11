import * as React from "react";

import { Typography } from "@material-ui/core";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";

import { withStyles, WithStyles } from "@material-ui/styles";

import { mergeStyles } from "../../utilities";

const circularStyles = {
    centeredContainer: {
        position: "relative"
    },
    centered: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    },
}

const styles = mergeStyles(circularStyles);

interface Props extends CircularProgressProps, WithStyles<typeof styles> {
    classes: WithStyles<typeof styles>['classes']
}

export const PercentageCircularProgress = withStyles(styles)(function (props: Props) {
    const { classes, value } = props;
    return (
        <div className={classes.centeredContainer}>
            <CircularProgress {...props} />
            <Typography variant="h5" className={classes.centered}>{value.toFixed()}%</Typography>
        </div>
    );
});