import * as React from "react";
import { Snackbar, SnackbarContent, Icon, IconButton, WithStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Close } from "@material-ui/icons";

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
            autoHideDuration={6000}
            onClose={props.onClose}
        >
            <SnackbarContent
                className={clsx(props.classes[props.variant])}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={props.classes.message}>
                        {props.message}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={props.onClose}>
                        <Close className={props.classes.icon} />
                    </IconButton>
                ]}
            />
        </Snackbar>
    )
});