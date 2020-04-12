import * as React from "react";

import * as Redux from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, Typography, Tooltip, IconButton, Paper } from "@material-ui/core";
import { Search, PieChartRounded, Add, Check, ArrowBack } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { DepartmentLoad, User, GroupDisciplineLoad, DisciplineTitle, StudentGroup, Faculty, UserDisciplineLoad, AppState, TrainingDepartment } from "../../models";

import { SearchInput } from "../common";
import { GroupDisciplineLoadDistribute, GroupsDisciplinesLoad } from "./groupDisciplineLoad";
import { DepartmentLoadPercentage } from "./DepartmentLoadPercentage";
import { UserDisciplineLoadChart } from "./userDisciplineLoad/UserDisciplineLoadChart";
import { GroupDisciplineLoadDetails } from "./groupDisciplineLoad/GroupDisciplineLoadDetails";
import { UserDisciplineLoadDetails } from "./userDisciplineLoad/UserDisciplineLoadDetails";
import { UserDisciplineLoadCard, UserDisciplineDataDetails } from "./userDisciplineLoad";
import { departmentLoadActions } from "../../store/departmentLoadStore";
import { userActions } from "../../store/userStore";
import { trainingDepartmentActions } from "../../store/trainingDepartmentStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const DepartmentLoadComponent = withStyles(styles)(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { userState, trainingDepartmentState, departmentLoadState } = Redux.useSelector((state: AppState) => ({
        userState: state.userState,
        trainingDepartmentState: state.trainingDepartmentState,
        departmentLoadState: state.departmentLoadState
    }));

    //#region Department load state
    const [groupDisciplineLoadDistributeOpen, setGroupDisciplineLoadDistributeOpen] = React.useState<boolean>(false);
    const [userDisciplineLoadDetailsOpen, setUserDisciplineLoadDetailsOpen] = React.useState<boolean>(false);
    const [selectedUser, setSelectedUser] = React.useState<User>(null);
    const [selectedGroupDisciplineLoadIndex, setSelectedGroupDisciplineLoadIndex] = React.useState<number>(-1);
    const [selectedGroupDisciplineLoad, setSelectedGroupDisciplineLoad] = React.useState<GroupDisciplineLoad>(null);
    const [openedGroupDisciplineLoadIndex, setOpenedGroupDisciplineLoadIndex] = React.useState<number>(-1);
    const [studyYearEdit, setStudyYearEdit] = React.useState<boolean>(false);
    const [userDisciplineLoadDataDetailsOpen, setUserDisciplineLoadDataDetailsOpen] = React.useState<boolean>(false);
    const [userGroupsDisciplinesLoad, setUserGroupsDisciplinesLoad] = React.useState<GroupDisciplineLoad[]>([]);

    const [usersDisciplinesLoad, setUsersDisciplinesLoad] = React.useState<UserDisciplineLoad[]>([]);

    function handleGroupDisciplineLoadSelect(index: number) {
        if (openedGroupDisciplineLoadIndex === index) {
            setOpenedGroupDisciplineLoadIndex(-1)
            return;
        }

        setOpenedGroupDisciplineLoadIndex(index);
    }

    function handleGroupDisciplineLoadDistributeCancel() {
        setGroupDisciplineLoadDistributeOpen(false);
    }

    function handleGroupDisciplineLoadDistributeAccept() {
        setGroupDisciplineLoadDistributeOpen(false);
    }

    async function handleGenerateStudyLoad() {
        dispatch(departmentLoadActions.generate(departmentLoad))
    }

    function handleStudyYearEdit() { setStudyYearEdit(true); }

    function handleStudyYearSave(newValue: string) {
        setStudyYearEdit(false);
        departmentLoad.studyYear = newValue;
        dispatch(departmentLoadActions.updateDetails(departmentLoad));
    }

    function handleStudyYearCancel() {
        setStudyYearEdit(false);
    }
    //#endregion

    //#region Filter state
    const [unallocatedLoadSearch, setunallocatedLoadSearch] = React.useState<string>('');

    function handleUnallocatedLoadSearchChange(newValue: string) {
        setunallocatedLoadSearch(newValue);
    }
    //#endregion

    const [groupDisciplineLoadDetailsOpen, setGroupDisciplineLoadDetailsOpen] = React.useState<boolean>(false);


    function handleGroupDisciplineLoadAdd() {
        setGroupDisciplineLoadDetailsOpen(true);
        setSelectedGroupDisciplineLoad(null);
        setSelectedGroupDisciplineLoadIndex(-1);
    }

    function handleGroupDisciplineLoadEdit(index: number) {
        setGroupDisciplineLoadDetailsOpen(true);

        const selected = groupDisciplineLoad[index];
        setSelectedGroupDisciplineLoad({ ...selected });
        setSelectedGroupDisciplineLoadIndex(index);
        setSelectedUser(null);
    }

    function handleGroupDisciplineLoadDelete(index: number) {
        dispatch(departmentLoadActions.deleteGroupDisciplineLoad(index));
    }

    function handleGroupDisciplineLoadDetailsCancel() {
        setGroupDisciplineLoadDetailsOpen(false);
        setSelectedGroupDisciplineLoad(null);
        setSelectedGroupDisciplineLoadIndex(-1);
    }

    function handleGroupDisciplineDetailsAccept(index: number, value: GroupDisciplineLoad) {
        setGroupDisciplineLoadDetailsOpen(false);
        dispatch(departmentLoadActions.updateGroupDisciplineLoad(index, value));
    }

    function handleGroupDisciplineLoadDistributeClick(index?: number) {
        setUserDisciplineLoadDetailsOpen(true);
        if (index !== undefined && index >= 0) {
            const load = groupDisciplineLoad[index];
            setSelectedGroupDisciplineLoad({ ...load });
            setSelectedGroupDisciplineLoadIndex(index);
        } else {
            setSelectedGroupDisciplineLoad(null);
            setSelectedGroupDisciplineLoadIndex(-1);
        }
        setSelectedUser(null);
        setOpenedGroupDisciplineLoadIndex(index);
    }

    function handleUserDisciplineLoadDetailsAccept(index: number, value: UserDisciplineLoad) {
        setUserDisciplineLoadDetailsOpen(false);
        setOpenedGroupDisciplineLoadIndex(-1);
        setSelectedUser(null);

        dispatch(departmentLoadActions.updateUserDisciplineLoad(index, value));
    }

    function handleUserDisciplineLoadDetailsCancel() {
        setUserDisciplineLoadDetailsOpen(false);
        setSelectedUser(null);
    }

    function handleUserDisciplineLoadEdit(index: number) {
        const userDisciplineLoad = usersDisciplinesLoad[index];
        const user = userDisciplineLoad.user;
        const userLoad = groupDisciplineLoad.filter(o => o.studyLoad && o.studyLoad.some(sl => sl.userLoad && sl.userLoad.some(ul => ul.userId === user.id)));

        setUserDisciplineLoadDataDetailsOpen(true);
        setUserGroupsDisciplinesLoad(userLoad);
        setSelectedUser(user);
    }

    function handleUserDisciplineLoadDelete(index: number) {
        const userDisciplineLoad = usersDisciplinesLoad[index];

        const studyLoad = groupDisciplineLoad.map(o => o.studyLoad)
            .reduce((prev, curr) => prev.concat(curr), [])
            .filter(o => o.userLoad && o.userLoad.every(ul => ul.userId === userDisciplineLoad.user.id));

        for (let load of studyLoad) {
            load.userLoad = load.userLoad.filter(o => o.userId !== userDisciplineLoad.user.id);
        }

        usersDisciplinesLoad.splice(index, 1);

        setUsersDisciplinesLoad([...usersDisciplinesLoad]);
    }

    function handleUserDisciplineLoadDataDetailsAccept() {

        setUserDisciplineLoadDataDetailsOpen(false);
    }

    function handleUserDisciplineLoadDataDetailsCancel() {

        setUserDisciplineLoadDataDetailsOpen(false);
    }

    function handleDepartmentLoadSave() {
        dispatch(departmentLoadActions.save(departmentLoad));
    }

    React.useEffect(() => { initialize(); }, [props.match.params]);

    function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        const tempDepartmentId = match.params && match.params[paths.departmentIdParameterName];
        const departmentId = parseInt(tempDepartmentId, null);

        dispatch(departmentLoadActions.getModel(id));
        dispatch(userActions.getUsers({ departmentId: id }));
        dispatch(trainingDepartmentActions.getTrainingDepartment(departmentId));
    }

    const handleBackClick = () => {
        const { history, match } = props;
        const tempDepartmentId = match.params && match.params[paths.departmentIdParameterName];
        const departmentId = parseInt(tempDepartmentId, null);
        history.push(paths.getDepartmentloadsPath(`${departmentId}`));
    }

    const { classes } = props;

    let departmentLoad: DepartmentLoad = null;
    if (departmentLoadState.modelLoading === false) {
        departmentLoad = departmentLoadState.model;
    }

    let departmentUsers: User[] = [];
    if (userState.usersLoading === false) {
        departmentUsers = userState.users;
    }

    let department: TrainingDepartment = null;
    if(trainingDepartmentState.trainingDepartmentLoading === false) {
        department = trainingDepartmentState.trainingDepartment;
    }

    const groupDisciplineLoad: GroupDisciplineLoad[] = departmentLoad && departmentLoad.groupDisciplineLoad || [];
    const total: number = departmentLoad && departmentLoad.total || 0;
    const studyYear: string = departmentLoad && departmentLoad.studyYear || '';

    const disabled = trainingDepartmentState.trainingDepartmentLoading && userState.usersLoading && departmentLoadState.modelLoading;

    const allocatedStudyLoad = groupDisciplineLoad.map(o => o.studyLoad).reduce((prev, curr) => prev.concat(curr), [])
        .filter(o => Boolean(o.userLoad)).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
    const unallocatedStudyLoad: number = total - allocatedStudyLoad;
    const percentage: number = (100 * allocatedStudyLoad / total) | 0;

    return (
        <Grid container direction="column">
            <Paper>
                <Grid container direction="row" alignItems="center">
                    <Tooltip title="Вернуться назад">
                        <span>
                            <IconButton disabled={disabled} onClick={handleBackClick}>
                                <ArrowBack />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Typography>Нагрузка кафедры</Typography>
                    <Grid item xs />
                    <Tooltip title="Сохранить нагрузку кафедры">
                        <span>
                            <IconButton disabled={disabled} onClick={handleDepartmentLoadSave}>
                                <Check />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Paper>
            <Grid container direction="row" className={classes.margin2Top}>
                <Grid className={clsx(classes.margin1Right)} item xs>
                    <Grid container direction="row" alignItems="center">
                        <Typography>Нераспределенная нагрузка</Typography>
                        <Grid item xs />
                        <Search className={classes.searchIcon} />
                        <SearchInput
                            search={unallocatedLoadSearch}
                            onSearchChange={handleUnallocatedLoadSearchChange}
                        />
                        <Tooltip title="Добавить учебную нагрузку">
                            <span>
                                <IconButton onClick={handleGroupDisciplineLoadAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Paper className={classes.margin1Y}>
                        <GroupsDisciplinesLoad
                            search={unallocatedLoadSearch}
                            openedIndex={openedGroupDisciplineLoadIndex}
                            groupsDisciplinesLoad={groupDisciplineLoad}
                            onEditClick={handleGroupDisciplineLoadEdit}
                            onDeleteClick={handleGroupDisciplineLoadDelete}
                            onDetailsOpen={handleGroupDisciplineLoadSelect}
                            onDistributeClick={handleGroupDisciplineLoadDistributeClick}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={3} className={classes.margin1Left}>
                    <DepartmentLoadPercentage
                        percentage={percentage}
                        totalLoad={total}
                        unallocatedStudyLoad={unallocatedStudyLoad}
                        studyYearEdit={studyYearEdit}
                        studyYear={studyYear}
                        onStudyYearEdit={handleStudyYearEdit}
                        onStudyYearSave={handleStudyYearSave}
                        onStudyYearCancel={handleStudyYearCancel}
                    />
                </Grid>
            </Grid>
            {usersDisciplinesLoad.length > 1 && (
                <Grid className={classes.margin2Top}>
                    <Typography>{"Нагрузка преподавателей"}</Typography>
                    <Card className={clsx(classes.fixedHeight300, classes.margin1Y)}>
                        <CardContent>
                            <UserDisciplineLoadChart chartData={usersDisciplinesLoad} />
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {Boolean(usersDisciplinesLoad.length) && (
                <Grid className={classes.margin2Top} container direction="column">
                    <Grid container direction="row" alignItems="center">
                        <Typography>Распределенная нагрузка</Typography>
                        <Grid item xs />
                        <Search className={classes.searchIcon} />
                        <SearchInput
                            search={unallocatedLoadSearch}
                            onSearchChange={handleUnallocatedLoadSearchChange}
                        />
                    </Grid>
                    <Grid className={classes.margin1Y} container direction="row" spacing={3}>
                        {usersDisciplinesLoad.map((o, index) => {
                            return (
                                <Grid key={index} item xs={4}>
                                    <UserDisciplineLoadCard
                                        index={index}
                                        userDisciplineLoad={{ ...o }}
                                        onEdit={handleUserDisciplineLoadEdit}
                                        onDelete={handleUserDisciplineLoadDelete}
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            )}
            <footer className={classes.footer}>
                <Paper className={classes.padding2Left}>
                    <Grid container direction="row" alignItems="center">
                        <Typography>Всего нагрузки: {total.toFixed(2)}ч. Распределено: {allocatedStudyLoad.toFixed(2)}ч.</Typography>
                        <Grid item xs />
                        <Tooltip title="Автоматическое распределение нагрузки">
                            <span>
                                <IconButton color="primary" onClick={handleGenerateStudyLoad}>
                                    <PieChartRounded />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {unallocatedStudyLoad ?
                            <Tooltip title="Распределить нагрузку">
                                <span>
                                    <IconButton color="primary" onClick={() => handleGroupDisciplineLoadDistributeClick()}>
                                        <Add />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            :
                            <Tooltip title="Сохранить распределение">
                                <span>
                                    <IconButton
                                        color="primary"
                                        className={clsx(!unallocatedStudyLoad && classes.buttonSuccess)}
                                        onClick={handleDepartmentLoadSave}
                                    >
                                        <Check />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        }
                    </Grid>
                </Paper>
            </footer>
            <GroupDisciplineLoadDistribute
                users={departmentUsers}
                groupDisciplineLoad={selectedGroupDisciplineLoad}
                open={groupDisciplineLoadDistributeOpen}
                onAccept={handleGroupDisciplineLoadDistributeAccept}
                onClose={handleGroupDisciplineLoadDistributeCancel}
            />
            <GroupDisciplineLoadDetails
                open={groupDisciplineLoadDetailsOpen}
                groupDisciplineLoad={selectedGroupDisciplineLoad}
                index={selectedGroupDisciplineLoadIndex}
                groups={department && department.groups || []}
                disciplinesTitles={department && department.titles || []}
                onAccept={handleGroupDisciplineDetailsAccept}
                onCancel={handleGroupDisciplineLoadDetailsCancel}
            />
            <UserDisciplineLoadDetails
                selectedUser={selectedUser}
                selectedGroupDisciplineLoadIndex={openedGroupDisciplineLoadIndex}
                selectedGroupDisciplineLoad={selectedGroupDisciplineLoad}
                groupsDisciplinesLoad={groupDisciplineLoad}
                users={departmentUsers}
                open={userDisciplineLoadDetailsOpen}
                onAccept={handleUserDisciplineLoadDetailsAccept}
                onCancel={handleUserDisciplineLoadDetailsCancel}
            />
            <UserDisciplineDataDetails
                groupsDisciplinesLoad={groupDisciplineLoad}
                open={userDisciplineLoadDataDetailsOpen}
                user={selectedUser}
                userGroupsDisciplinesLoad={userGroupsDisciplinesLoad}
                onAccept={handleUserDisciplineLoadDataDetailsAccept}
                onCancel={handleUserDisciplineLoadDataDetailsCancel}
            />
        </Grid >
    );
});