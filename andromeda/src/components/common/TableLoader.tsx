import * as React from "react";
import { mergeStyles } from "../../utilities";
import { WithStyles, withStyles } from "@material-ui/styles";
import { LinearProgress } from "@material-ui/core";

const tdStyles = {
    padding0: {
        padding: 0
    }
}

const styles = mergeStyles(tdStyles);

interface Props extends WithStyles<typeof styles> {
    colSpan: number;
}

function TableLoaderBase(props: Props) {
    return (
        <tr>
            <td className={props.classes.padding0} colSpan={props.colSpan}>
                <LinearProgress variant="query" />
            </td>
        </tr>
    );
}

export const TableLoader = withStyles(styles)(TableLoaderBase);