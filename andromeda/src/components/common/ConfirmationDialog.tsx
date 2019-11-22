import * as React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";

interface Props {
    open: boolean;
    message: string;
    onClose: (result: boolean) => void
}

export const ConfirmationDialog = function (props: Props) {
    const message = props.message;
    const open = props.open;

    const handleCancel = () => props.onClose(false);
    const handleOk = () => props.onClose(true);

    return (
        <Dialog onClose={handleCancel} open={open}>
            <DialogTitle>{message}</DialogTitle>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Нет
                </Button>
                <Button onClick={handleOk} color="primary" autoFocus>
                    Да
                </Button>
            </DialogActions>
        </Dialog>
    );
}