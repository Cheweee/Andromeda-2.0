import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { mergeStyles } from "../../utilities";
import { Typography } from "@material-ui/core";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";

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

class PercentageCircularProgressBase extends React.Component<Props> {
    render() {
        const {
            classes,
            value
        } = this.props;
        return (
            <div className={classes.centeredContainer}>
                <CircularProgress {...this.props} />
                <Typography variant="h5" className={classes.centered}>{value.toFixed()}%</Typography>
            </div>
        );
    }
}

export const PercentageCircularProgress = withStyles(styles)(PercentageCircularProgressBase);