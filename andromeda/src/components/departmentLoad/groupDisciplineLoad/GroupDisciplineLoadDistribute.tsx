import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { GroupDisciplineLoad, User } from "../../../models";
import { departmentLoadService } from "../../../services/departmentLoadService";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    groupDisciplineLoad: GroupDisciplineLoad;
    users: User[];
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const GroupDisciplineLoadDistribute = withStyles(styles)(function (props: Props) {
    const {
        open,
        groupDisciplineLoad,
        users,
        onClose,
        onAccept
    } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>{`Нагрузка дисциплины на группу`}</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={onAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});