import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    colSpan: number;
}

export const TableLoader = withStyles(styles)(function (props: Props) {
    const {
        classes,
        colSpan
    } = props;

    return (
        <tr>
            <td className={classes.padding0} colSpan={colSpan}>
                <LinearProgress variant="query" />
            </td>
        </tr>
    );
});