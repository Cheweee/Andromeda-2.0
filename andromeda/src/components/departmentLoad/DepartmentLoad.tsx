import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import {
    DepartmentLoad,
    ApplicationError,
    StudyLoad,
    User,
    GroupDisciplineLoad,
    DisciplineTitle,
    StudentGroup,
    DepartmentType,
    Faculty,
    UserDisciplineLoad
} from "../../models";
import { paths } from "../../sharedConstants";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Tooltip,
    CircularProgress,
    IconButton,
    Paper
} from "@material-ui/core";
import { departmentLoadService } from "../../services/departmentLoadService";
import { MessageSnackbar, SearchInput } from "../common";
import {
    Search,
    PieChartRounded,
    Add,
    Check,
    ArrowBack,
} from "@material-ui/icons";
import clsx from "clsx";
import { GroupDisciplineLoadDistribute, GroupsDisciplinesLoad } from "./groupDisciplineLoad";
import { departmentService, userService } from "../../services";
import { DepartmentLoadPercentage } from "./DepartmentLoadPercentage";
import { UserDisciplineLoadChart } from "./userDisciplineLoad/UserDisciplineLoadChart";
import { GroupDisciplineLoadDetails } from "./groupDisciplineLoad/GroupDisciplineLoadDetails";
import { UserDisciplineLoadDetails } from "./userDisciplineLoad/UserDisciplineLoadDetails";
import { UserDisciplineLoadCard, UserDisciplineDataDetails } from "./userDisciplineLoad";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }


export const DepartmentLoadComponent = withStyles(styles)(function (props: Props) {
    //#region Department load state
    const [departmentLoadId, setDepartmentLoadId] = React.useState<number>(null);
    const [departmentId, setDepartmentId] = React.useState<number>(-1);
    const [studyYear, setStudyYear] = React.useState<string>('');
    const [total, setTotal] = React.useState<number>(0);
    const [groupsDisciplinesLoad, setGroupsDisciplinesLoad] = React.useState<GroupDisciplineLoad[]>([]);
    const [faculty, setFaculty] = React.useState<Faculty>(Faculty.initial);
    const [groupDisciplineLoadDistributeOpen, setGroupDisciplineLoadDistributeOpen] = React.useState<boolean>(false);
    const [userDisciplineLoadDetailsOpen, setUserDisciplineLoadDetailsOpen] = React.useState<boolean>(false);
    const [selectedUser, setSelectedUser] = React.useState<User>(null);
    const [selectedGroupDisciplineLoad, setSelectedGroupDisciplineLoad] = React.useState<GroupDisciplineLoad>(null);
    const [openedGroupDisciplineLoadIndex, setOpenedGroupDisciplineLoadIndex] = React.useState<number>(-1);
    const [studyYearEdit, setStudyYearEdit] = React.useState<boolean>(false);
    const [userDisciplineLoadDataDetailsOpen, setUserDisciplineLoadDataDetailsOpen] = React.useState<boolean>(false);
    const [userGroupsDisciplinesLoad, setUserGroupsDisciplinesLoad] = React.useState<GroupDisciplineLoad[]>([]);

    const [disciplinesTitles, setDisciplinesTitles] = React.useState<DisciplineTitle[]>([]);
    const [usersDisciplinesLoad, setUsersDisciplinesLoad] = React.useState<UserDisciplineLoad[]>([]);
    const [groups, setGroups] = React.useState<StudentGroup[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);

    async function getDepartment() {
        try {
            const { match } = props;

            const tempId = match.params && match.params[paths.departmentIdParameterName];
            setLoading(true);

            const departmentId = parseInt(tempId, 0);
            let departments = await departmentService.getTrainingDepartments({ id: departmentId, type: DepartmentType.TrainingDepartment });
            let departmentUsers = await userService.get({ departmentId: departmentId });
            let department = departments[0];

            let disciplinesTitles = department.titles || [];
            let groups = department.groups || [];

            setFaculty(department.parent as Faculty);
            setDisciplinesTitles(disciplinesTitles);
            setGroups(groups);
            setUsers(departmentUsers);
        }
        catch (error) {
            //if (error instanceof ApplicationError)
                //setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }

    async function getDepartmentLoad() {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        let departmentLoad: DepartmentLoad = DepartmentLoad.initial;
        try {
            setLoading(true);
            const id = parseInt(tempId, 0);
            if (id) {
                const loads = await departmentLoadService.getDepartmentLoads({ id });
                departmentLoad = loads[0];
            }

            setDepartmentLoadId(departmentLoad.id);
            setDepartmentId(departmentId);
            setTotal(departmentLoad.total);
            setStudyYear(departmentLoad.studyYear);
            setGroupsDisciplinesLoad(departmentLoad.groupDisciplineLoad);

            await getDepartment();
            await getDepartmentUsers();
            setLoading(false);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                //setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
        }
    }

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

    function handleSaveStudyLoad() {
        const timer = setTimeout(() => {
            setSaving(false);
            //setSnackbar('Учебная нагрузка кафедры успешно сохранена', true, SnackbarVariant.success);

            clearTimeout(timer);
        }, 2500);
        setSaving(true);
    }

    async function handleGenerateStudyLoad() {
        try {
            setGenerating(true);


            //setDepartmentLoad(load);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                //setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setGenerating(false);
        }
    }

    function handleStudyYearEdit() { setStudyYearEdit(true); }

    function handleStudyYearSave(newValue: string) {
        setStudyYearEdit(false);
        setStudyYear(newValue);
    }

    function handleStudyYearCancel() {
        setStudyYearEdit(false);
    }

    React.useEffect(() => {
        getDepartmentLoad();
    }, [props.match.params]);

    //#endregion

    //#region Department users state
    const [departmentUsers, setDepartmentUsers] = React.useState<User[]>([]);

    async function getDepartmentUsers() {
        try {
            const { match } = props;

            const tempId = match.params && match.params[paths.departmentIdParameterName];
            setLoading(true);

            const departmentId = parseInt(tempId, 0);
            const users = await userService.get({
                departmentId: departmentId
            });

            setDepartmentUsers(users);
        }
        catch (error) {
            //if (error instanceof ApplicationError)
                //setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }
    //#endregion

    //#region Filter state
    const [unallocatedLoadSearch, setunallocatedLoadSearch] = React.useState<string>();

    function handleUnallocatedLoadSearchChange(newValue: string) {
        setunallocatedLoadSearch(newValue);
    }
    //#endregion

    const [saving, setSaving] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [generating, setGenerating] = React.useState<boolean>(false);
    const [groupDisciplineLoadDetailsOpen, setGroupDisciplineLoadDetailsOpen] = React.useState<boolean>(false);

    const handleBackClick = () => {
        const { history } = props;
        history.push(paths.getDepartmentloadsPath(`${departmentId}`));
    }

    function handleGroupDisciplineLoadAdd() {
        setGroupDisciplineLoadDetailsOpen(true);

        setSelectedGroupDisciplineLoad(null);
    }

    function handleGroupDisciplineLoadEdit(index: number) {
        setGroupDisciplineLoadDetailsOpen(true);

        const selected = groupsDisciplinesLoad[index];
        setSelectedGroupDisciplineLoad({ ...selected });
        setSelectedUser(null);
    }

    function handleGroupDisciplineLoadDelete(index: number) {
        groupsDisciplinesLoad.splice(index, 1);
        setGroupsDisciplinesLoad([...groupsDisciplinesLoad]);
    }

    function handleGroupDisciplineLoadDetailsCancel() {
        setGroupDisciplineLoadDetailsOpen(false);
        setSelectedGroupDisciplineLoad(null);
    }

    function handleGroupDisciplineDetailsAccept(value: GroupDisciplineLoad) {
        setGroupDisciplineLoadDetailsOpen(false);
        groupsDisciplinesLoad.filter(o => o.id !== value.id);

        groupsDisciplinesLoad.push({
            amount: value.amount,
            disciplineTitle: value.disciplineTitle,
            disciplineTitleId: value.disciplineTitleId,
            semesterNumber: value.semesterNumber,
            studentGroup: value.studentGroup,
            studentGroupId: value.studentGroupId,
            faculty: faculty,
            facultyId: faculty.id,
            studyLoad: value.studyLoad
        });

        setGroupsDisciplinesLoad({ ...groupsDisciplinesLoad });
    }

    function handleGroupDisciplineLoadDistributeClick(index?: number) {
        setUserDisciplineLoadDetailsOpen(true);
        if (index !== undefined && index >= 0) {
            const load = groupsDisciplinesLoad[index];
            setSelectedGroupDisciplineLoad({ ...load });
        } else {
            setSelectedGroupDisciplineLoad(null);
        }
        setSelectedUser(null);
        setOpenedGroupDisciplineLoadIndex(index);
    }

    function handleUserDisciplineLoadDetailsAccept(index: number, value: UserDisciplineLoad) {
        setUserDisciplineLoadDetailsOpen(false);

        const load = usersDisciplinesLoad.find(o => o.user.id === value.user.id);
        const groupDisciplineLoad = groupsDisciplinesLoad[index];
        const studyLoadInStream = groupDisciplineLoad.studyLoad.filter(o => StudyLoad.getGroupsInStream(o.shownValue) > 1);
        const selectedStudyLoad = groupDisciplineLoad.studyLoad.filter(o => value.studyLoad.some(vsl => vsl.projectType === o.projectType));
        for (let studyLoad of selectedStudyLoad) {
            if (!studyLoad.userLoad) {
                studyLoad.userLoad = [];
            }
            studyLoad.userLoad.push({
                studentsCount: -1,
                studyLoadId: studyLoad.id,
                user: value.user,
                userId: value.user.id
            });
        }

        const additionalLoad = groupsDisciplinesLoad.filter(o =>
            o.disciplineTitleId === groupDisciplineLoad.disciplineTitleId &&
            o.studentGroupId !== groupDisciplineLoad.studentGroupId &&
            o.semesterNumber === groupDisciplineLoad.semesterNumber
        );
        const additionalStudyLoad = additionalLoad
            .map(o => o.studyLoad)
            .reduce((prev, curr) => prev.concat(curr), [])
            .filter(o => studyLoadInStream.some(sls => sls.projectType === o.projectType));

        for (let studyLoad of additionalStudyLoad) {
            if (!studyLoad.userLoad) {
                studyLoad.userLoad = [];
            }
            studyLoad.userLoad.push({
                studentsCount: -1,
                studyLoadId: studyLoad.id,
                user: value.user,
                userId: value.user.id
            });
        }

        value.studyLoad = value.studyLoad.concat(additionalStudyLoad);

        if (load) {
            load.amount += value.amount;
            load.studyLoad = load.studyLoad.concat(value.studyLoad);
        } else {
            usersDisciplinesLoad.push(value);
        }

        setGroupsDisciplinesLoad([...groupsDisciplinesLoad]);
        setUsersDisciplinesLoad([...usersDisciplinesLoad]);
        setOpenedGroupDisciplineLoadIndex(-1);
        setSelectedUser(null);
    }

    function handleUserDisciplineLoadDetailsCancel() {
        setUserDisciplineLoadDetailsOpen(false);
        setSelectedUser(null);
    }

    function handleUserDisciplineLoadEdit(index: number) {
        const userDisciplineLoad = usersDisciplinesLoad[index];
        const user = userDisciplineLoad.user;
        const userLoad = groupsDisciplinesLoad.filter(o => o.studyLoad && o.studyLoad.some(sl => sl.userLoad && sl.userLoad.some(ul => ul.userId === user.id)));

        setUserDisciplineLoadDataDetailsOpen(true);
        setUserGroupsDisciplinesLoad(userLoad);
        setSelectedUser(user);
    }

    function handleUserDisciplineLoadDelete(index: number) {
        const userDisciplineLoad = usersDisciplinesLoad[index];

        const studyLoad = groupsDisciplinesLoad.map(o => o.studyLoad)
            .reduce((prev, curr) => prev.concat(curr), [])
            .filter(o => o.userLoad && o.userLoad.every(ul => ul.userId === userDisciplineLoad.user.id));

        for (let load of studyLoad) {
            load.userLoad = load.userLoad.filter(o => o.userId !== userDisciplineLoad.user.id);
        }

        usersDisciplinesLoad.splice(index, 1);

        setUsersDisciplinesLoad([...usersDisciplinesLoad]);
        setGroupsDisciplinesLoad([...groupsDisciplinesLoad]);
    }

    function handleUserDisciplineLoadDataDetailsAccept() {

        setUserDisciplineLoadDataDetailsOpen(false);
    }

    function handleUserDisciplineLoadDataDetailsCancel() {

        setUserDisciplineLoadDataDetailsOpen(false);
    }

    async function handleDepartmentLoadSave() {
        try {
            setLoading(true);
            let departmentLoad: DepartmentLoad = {
                studyYear: studyYear,
                total: total,
                departmentId: departmentId,
                groupDisciplineLoad: groupsDisciplinesLoad
            };
            if (departmentLoadId)
                departmentLoad = await departmentLoadService.update(departmentLoad);
            else
                departmentLoad = await departmentLoadService.create(departmentLoad);
        }
        catch (error) {
            //if (error instanceof ApplicationError)
                //setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }

    const { classes } = props;

    const allocatedStudyLoad = groupsDisciplinesLoad.map(o => o.studyLoad).reduce((prev, curr) => prev.concat(curr), [])
        .filter(o => Boolean(o.userLoad)).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
    const unallocatedStudyLoad: number = total - allocatedStudyLoad;
    const percentage: number = (100 * allocatedStudyLoad / total) | 0;

    return (
        <Grid container direction="column">
            <Paper>
                <Grid container direction="row" alignItems="center">
                    <Tooltip title="Вернуться назад">
                        <span>
                            <IconButton disabled={loading} onClick={handleBackClick}>
                                <ArrowBack />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Typography>Нагрузка кафедры</Typography>
                    <Grid item xs />
                    <Tooltip title="Сохранить нагрузку кафедры">
                        <span>
                            <IconButton disabled={loading} onClick={handleDepartmentLoadSave}>
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
                            groupsDisciplinesLoad={groupsDisciplinesLoad}
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
                                    {generating ? (<CircularProgress size={24} />) : (<PieChartRounded />)}
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
                                        className={clsx(!unallocatedStudyLoad && !saving && classes.buttonSuccess)}
                                        onClick={handleSaveStudyLoad}
                                    >
                                        {saving ? (<CircularProgress size={24} />) : (<Check />)}
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
                groups={groups}
                disciplinesTitles={disciplinesTitles}
                onAccept={handleGroupDisciplineDetailsAccept}
                onCancel={handleGroupDisciplineLoadDetailsCancel}
            />
            <UserDisciplineLoadDetails
                selectedUser={selectedUser}
                selectedGroupDisciplineLoadIndex={openedGroupDisciplineLoadIndex}
                selectedGroupDisciplineLoad={selectedGroupDisciplineLoad}
                groupsDisciplinesLoad={groupsDisciplinesLoad}
                users={users}
                open={userDisciplineLoadDetailsOpen}
                onAccept={handleUserDisciplineLoadDetailsAccept}
                onCancel={handleUserDisciplineLoadDetailsCancel}
            />
            <UserDisciplineDataDetails
                groupsDisciplinesLoad={groupsDisciplinesLoad}
                open={userDisciplineLoadDataDetailsOpen}
                user={selectedUser}
                userGroupsDisciplinesLoad={userGroupsDisciplinesLoad}
                onAccept={handleUserDisciplineLoadDataDetailsAccept}
                onCancel={handleUserDisciplineLoadDataDetailsCancel}
            />
        </Grid >
    );
});