import * as React from "react";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, withStyles, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, TextField, Typography, List, ListItem, ListItemIcon, Checkbox, ListItemText, Tooltip } from "@material-ui/core";
import { User, UserDisciplineLoadValidation, StudentGroup, GroupDisciplineLoad, DisciplineTitle, StudyLoad, ProjectType, UserLoad, UserDisciplineLoad } from "../../../models";
import { Autocomplete } from "@material-ui/lab";
import { Help, HelpOutline, PermContactCalendar } from "@material-ui/icons";
import { departmentLoadService } from "../../../services/departmentLoadService";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly open: boolean;
    readonly users: User[];
    readonly groupsDisciplinesLoad: GroupDisciplineLoad[];
    
    selectedGroupDisciplineLoadIndex: number;
    selectedGroupDisciplineLoad: GroupDisciplineLoad;
    selectedUser: User;

    onAccept: (index: number, value: UserDisciplineLoad) => void;
    onCancel: () => void;
}

export const UserDisciplineLoadDetails = withStyles(styles)(function (props: Props) {
    const [user, setUser] = React.useState<User>(User.initial);
    const [groupDisciplineLoad, setGroupDisciplineLoad] = React.useState<GroupDisciplineLoad>(GroupDisciplineLoad.initial);
    const [alreadyDistributedLoad, setAlreadyDistributedLoad] = React.useState<UserLoad[]>([])
    const [studyLoad, setStudyLoad] = React.useState<StudyLoad[]>([]);
    const [selectedStudyLoad, setSelectedStudyLoad] = React.useState<StudyLoad[]>([]);
    const [formErrors, setFormErrors] = React.useState<UserDisciplineLoadValidation>(UserDisciplineLoadValidation.initial);

    React.useEffect(() => {
        setUser(props.selectedUser);
    }, [props.selectedUser]);

    React.useEffect(() => {
        const groupDisciplineLoad = props.selectedGroupDisciplineLoad;
        const studyLoad = props.selectedGroupDisciplineLoad ? props.selectedGroupDisciplineLoad.studyLoad : [];
        const alreadyDistributedLoad = studyLoad
            .filter(o => Boolean(o.userLoad)).map(o => o.userLoad)
            .reduce((prev, curr) => prev.concat(curr), []);

        setGroupDisciplineLoad(groupDisciplineLoad);
        setAlreadyDistributedLoad(alreadyDistributedLoad);
        setStudyLoad(studyLoad);
    }, [props.selectedGroupDisciplineLoad]);

    React.useEffect(() => {
        setUser(props.selectedUser);
    }, [props.selectedUser]);

    React.useEffect(() => {
        const studyLoad = groupDisciplineLoad ? groupDisciplineLoad.studyLoad : [];
        const alreadyDistributedLoad = studyLoad
            .filter(o => Boolean(o.userLoad)).map(o => o.userLoad)
            .reduce((prev, curr) => prev.concat(curr), []);

        setAlreadyDistributedLoad(alreadyDistributedLoad);
    }, [groupDisciplineLoad]);

    React.useEffect(() => {
        const formErrors = departmentLoadService.validateUserDisciplineLoad({
            user: user,
            studyLoad: studyLoad
        });

        const groupDisciplineLoadMessage = departmentLoadService.validateGroupDisciplineLoadNotNull(groupDisciplineLoad);
        formErrors.groupDiscplineLoadError = groupDisciplineLoadMessage;
        formErrors.isValid = formErrors.isValid && !groupDisciplineLoadMessage;

        setFormErrors(formErrors);
    }, [user, groupDisciplineLoad])

    const {
        classes,

        open,
        users,
        groupsDisciplinesLoad,

        onCancel
    } = props;

    function handleSelectedUserChange(event: React.ChangeEvent, value: User) {
        setUser(value);
    }

    function handleGroupDisciplineLoadChange(event: React.ChangeEvent, value: GroupDisciplineLoad) {
        const studyLoad = value ? value.studyLoad : [];
        setGroupDisciplineLoad(value);
        setStudyLoad(studyLoad);
        setSelectedStudyLoad([]);
    }

    function handleSelectStudyLoad(value: StudyLoad) {
        const index = selectedStudyLoad.indexOf(value);
        if (index >= 0) {
            selectedStudyLoad.splice(index, 1);
        } else {
            selectedStudyLoad.push(value);
        }

        setSelectedStudyLoad(selectedStudyLoad.slice());
    }

    function handleAccept() {
        const { onAccept } = props;

        const amount = studyLoad.map(o => o.value).reduce((prev, curr) => prev + curr, 0);

        const value: UserDisciplineLoad = {
            studyLoad: selectedStudyLoad,
            user: user,
            amount: amount
        };

        let index = props.groupsDisciplinesLoad.indexOf(groupDisciplineLoad);
        if(index < 0)
            index = props.selectedGroupDisciplineLoadIndex;

        setUser(null);
        setStudyLoad([]);
        setSelectedStudyLoad([]);
        setGroupDisciplineLoad(null);
        onAccept(index, value);
    }

    function handleCancel() {
        const { onCancel } = props;

        setUser(null);
        setStudyLoad([]);
        setSelectedStudyLoad([]);
        setGroupDisciplineLoad(null);

        onCancel();
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
        <Dialog fullWidth maxWidth="md" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Нагрузка преподавателя</DialogTitle>
            <DialogContent>
                <Autocomplete
                    className={classes.w100}
                    noOptionsText={"Преподаватель не найден"}
                    getOptionLabel={(option: User) => User.getName(option)}
                    options={users}
                    value={user}
                    onChange={handleSelectedUserChange}
                    renderOption={(option: User) => User.getName(option)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Преподаватель"
                            placeholder="Выберите преподавателя"
                            value={user ? User.getFullName(user) : ''}
                            error={Boolean(formErrors.userError)}
                            helperText={formErrors.userError}
                        />
                    )}
                />
                <Autocomplete
                    className={classes.w100}
                    noOptionsText={"Учебная нагрузка не найдена"}
                    getOptionLabel={(option: GroupDisciplineLoad) => GroupDisciplineLoad.getDescription(option)}
                    options={groupsDisciplinesLoad}
                    value={groupDisciplineLoad}
                    onChange={handleGroupDisciplineLoadChange}
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
                            error={Boolean(formErrors.groupDiscplineLoadError)}
                            helperText={formErrors.groupDiscplineLoadError}
                        />
                    )}
                />
                <List>
                    {studyLoad.map(function (load, index) {
                        const distributed = alreadyDistributedLoad.find(o => o.studyLoadId === load.id);
                        return (
                            <ListItem key={index} button onClick={() => handleSelectStudyLoad(load)}>
                                <ListItemIcon>
                                    {distributed ? (
                                        <Tooltip title={`Нагрузка уже распределена на пользователя ${User.getFullName(distributed.user)}`}>
                                            <PermContactCalendar color="disabled" />
                                        </Tooltip>
                                    ) : (
                                            <Checkbox
                                                edge="start"
                                                checked={selectedStudyLoad.indexOf(load) >= 0}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        )}
                                </ListItemIcon>
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
            </DialogContent>
            <DialogActions>
                <Grid container direction="row">
                    <Grid item xs />
                    <Button onClick={handleCancel}>Отмена</Button>
                    <Button onClick={handleAccept} disabled={!formErrors.isValid} color="primary" autoFocus>
                        Сохранить
                    </Button>
                </Grid>
            </DialogActions>
        </Dialog>
    );
});