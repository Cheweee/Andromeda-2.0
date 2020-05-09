import * as React from "react";
import { Snackbar, SnackbarContent, IconButton, WithStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    message: string;
    onClose: () => void;
    variant: "success" | "error" | "warning" | "info";
}

export const MessageSnackbar = withStyles(styles)(function (props: Props) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={props.open}
            autoHideDuration={5000}
            onClose={props.onClose}
        >
            <Alert elevation={6} variant="filled" onClose={props.onClose} severity={props.variant}>
                {props.message}
            </Alert>
        </Snackbar>
    )
});