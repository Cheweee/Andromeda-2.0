import * as React from "react";
import { WithStyles, withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, TextField, Typography, List, ListItem, ListItemIcon, Tooltip, Checkbox, ListItemText } from "@material-ui/core";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { UserDisciplineLoad, User, GroupDisciplineLoad, ProjectType, StudyLoad } from "../../../models";
import { Autocomplete } from "@material-ui/lab";
import { PermContactCalendar, HelpOutline } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly open: boolean;
    readonly user: User;
    readonly groupsDisciplinesLoad: GroupDisciplineLoad[];

    userGroupsDisciplinesLoad: GroupDisciplineLoad[];

    onAccept: () => void;
    onCancel: () => void;
}

export const UserDisciplineDataDetails = withStyles(styles)(function (props: Props) {
    const [user, setUser] = React.useState<User>(User.initial);
    const [groupDisciplineLoad, setGroupDisciplineLoad] = React.useState<GroupDisciplineLoad[]>([]);
    const [groupsDisciplinesLoad, setGroupsDisciplinesLoad] = React.useState<GroupDisciplineLoad[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    React.useEffect(() => { setUser(props.user || User.initial); }, [props.user]);

    React.useEffect(() => {
        setGroupDisciplineLoad(props.userGroupsDisciplinesLoad || []);
    }, [props.userGroupsDisciplinesLoad]);

    React.useEffect(() => {
        setGroupsDisciplinesLoad(props.groupsDisciplinesLoad || []);
    }, [props.groupsDisciplinesLoad]);

    React.useEffect(() => {
        const studyLoad = groupDisciplineLoad.map(o => o.studyLoad).reduce((prev, curr) => prev.concat(curr), []);
        const total = studyLoad.filter(o => o.usersLoad && o.usersLoad.some(ul => ul.userId === user.id))
            .map(o => o.value).reduce((summ, curr) => summ + curr, 0);

        setTotal(total);
    }, [groupDisciplineLoad]);

    const {
        open,
        classes

    } = props;

    function handleCancel() {
        const { onCancel } = props;

        onCancel();
    }

    function handleAccept() {
        const { onAccept } = props;

        onAccept();
    }

    function getGroupDisciplineLoadDescription(value: GroupDisciplineLoad): JSX.Element {
        return (
            <Grid container direction="row" key={value.id}>
                <Grid item xs className={classes.margin1X}>
                    <Typography>{value.disciplineTitle.name}</Typography>
                </Grid>
                <Grid item xs={2} className={classes.margin1X}>
                    <Typography>{`${value.semesterNumber} сем.`}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>{`${value.studentGroup.name} (${value.studentGroup.studentsCount} ст.)`}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography>{`Всего: ${value.amount.toFixed(2)} ч.`}</Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <Dialog fullWidth maxWidth="md" scroll="paper" open={open} onClose={handleCancel}>
            <DialogTitle>Детальная нагрузка преподавателя {User.getFullInitials(user)}</DialogTitle>
            <DialogContent>
                <Grid>
                    {groupDisciplineLoad.map((groupDisciplineLoad, index) => {
                        const userStudyLoad = groupDisciplineLoad.studyLoad.filter(o => o.usersLoad && o.usersLoad.some(ul => ul.userId === user.id))
                        return (
                            <Grid>
                                <Autocomplete
                                    className={classes.w100}
                                    noOptionsText={"Учебная нагрузка не найдена"}
                                    getOptionLabel={(option: GroupDisciplineLoad) => GroupDisciplineLoad.getDescription(option)}
                                    options={groupsDisciplinesLoad}
                                    value={groupDisciplineLoad}
                                    //onChange={handleGroupDisciplineLoadChange}
                                    renderOption={(option: GroupDisciplineLoad) => getGroupDisciplineLoadDescription(option)}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            label="Учебная нагрузка"
                                            placeholder="Выберите учебную нагрузку"
                                            value={groupDisciplineLoad ? GroupDisciplineLoad.getDescription(groupDisciplineLoad) : ''}
                                        //error={Boolean(formErrors.groupDiscplineLoadError)}
                                        //helperText={formErrors.groupDiscplineLoadError}
                                        />
                                    )}
                                />
                                <List>
                                    {userStudyLoad.map(function (load, index) {
                                        return (
                                            <ListItem key={index} button>
                                                <ListItemText key={load.id}>
                                                    <Grid container direction="row">
                                                        <Grid item xs>
                                                            <Typography>{ProjectType.getProjectTypeDescription(load.projectType)}</Typography>
                                                        </Grid>
                                                        {load.projectType === ProjectType.lection && (
                                                            <Grid container direction="row" item xs={3}>
                                                                <Typography>{`${StudyLoad.getGroupsInStream(load.shownValue)} гр. в потоке`}</Typography>
                                                                <Tooltip title="Обратите внимание, если вы распределяете нагрузку по дисциплине с несколькими группами в потоке, то нагрузка будет применена ко всем группам в потоке, но значение нагрузки не изменится">
                                                                    <HelpOutline color="disabled" className={classes.margin1Left} />
                                                                </Tooltip>
                                                            </Grid>
                                                        )}
                                                        <Grid item>
                                                            <Typography>{`${load.shownValue} ч.`}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ListItemText>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Grid>
                        );
                    })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container direction="row">
                    <Typography>Всего: {total.toFixed(2)} ч.</Typography>
                    <Grid item xs />
                    <Button onClick={handleCancel}>Отмена</Button>
                    <Button onClick={handleAccept} color="primary" autoFocus>Сохранить</Button>
                </Grid>
            </DialogActions>
        </Dialog>
    );
});