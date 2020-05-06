import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Tooltip, IconButton, Card, CardHeader, CardContent, LinearProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Breadcrumbs, Link } from "@material-ui/core";
import { ArrowBack, Close, Check, ExpandMore, Add, BarChart } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { TrainingDepartment, DepartmentType, Faculty, User, RoleInDepartment, StudyDirection, StudentGroup, DisciplineTitle, AppState, UserRoleInDepartment } from "../../models";

import { DepartmentDetails } from "./DepartmentDetails";
import { UsersRolesInDepartment, UserRolesInDepartmentDetails } from "./UsersRolesInDepartments";
import { StudentGroups, StudentGroupDetails } from "./StudentGroups";
import { StudyDirections, StudyDirectionDetails } from "./StudyDirections";
import { DisciplineTitleDetails, DisciplinesTitles } from "./DisciplinesTitles";

import { trainingDepartmentActions } from "../../store/trainingDepartmentStore";
import { userActions } from "../../store/userStore";
import { facultyActions } from "../../store/facultyStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const TrainingDepartmentComponent = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { trainingDepartmentState, userState, facultyState } = Redux.useSelector((state: AppState) => ({
        trainingDepartmentState: state.trainingDepartmentState,
        facultyState: state.facultyState,
        userState: state.userState
    }));

    //#regnion Training department state
    function handleDepartmentDetailsChange(model: TrainingDepartment) {
        dispatch(trainingDepartmentActions.updateTrainingDepartmentDetails(model));
    }
    //#endregion

    //#region Study direction details state
    const [selectedStudyDirection, setSelectedStudyDirection] = React.useState(null);
    const [studyDirectionDetailsOpen, setStudyDirectionDetailsOpen] = React.useState(false);

    function handleStudyDirectionAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setStudyDirectionDetailsOpen(true);
        setSelectedStudyDirection(null);
    }

    function handleStudyDirectionEdit(name: string) {
        const direction = department.studyDirections.find(o => o.name === name);

        setStudyDirectionDetailsOpen(true);
        setSelectedStudyDirection(direction);
    }

    function handleStudyDirectionDelete(name: string) {
        dispatch(trainingDepartmentActions.deleteTrainingDepartmentStudyDirections(name));
    }

    function handleStudyDirectionDetailsAccept(direction: StudyDirection) {
        dispatch(trainingDepartmentActions.updateTrainingDepartmentStudyDirections(direction));

        setStudyDirectionDetailsOpen(false);
        setSelectedStudyDirection(null);
    }

    function handleStudyDirectionDetailsCancel() {
        setStudyDirectionDetailsOpen(false);
        setSelectedStudyDirection(null);
    }
    //#endregion

    //#region Student group details state
    const [selectedStudentGroup, setSelectedStudentGroup] = React.useState(null);
    const [studentGroupOpen, setStudentGroupOpen] = React.useState(false);

    function handleGroupAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setStudentGroupOpen(true);
        setSelectedStudentGroup(null);
    }

    function handleGroupEdit(name: string) {
        const group = department.groups.find(o => o.name === name);

        setStudentGroupOpen(true);
        setSelectedStudentGroup(group);
    }

    function handleGroupDelete(name: string) {
        dispatch(trainingDepartmentActions.deleteTrainingDepartmentStudentGroups(name));
    }

    function handleStudentGroupDetailsAccept(group: StudentGroup) {
        dispatch(trainingDepartmentActions.updateTrainingDepartmentStudentGroups(group));

        setStudentGroupOpen(false);
        setSelectedStudentGroup(null);
    }

    function handleStudentGroupDetailsCancel() {
        setStudentGroupOpen(false);
        setSelectedStudentGroup(null);
    }
    //#endregion

    //#region Discipline title details state
    const [selectedTitle, setSelectedTitle] = React.useState(null);
    const [disciplineTitleOpen, setDisciplineTitleOpen] = React.useState(false);

    function handleDisciplineTitleAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setDisciplineTitleOpen(true);
        setSelectedTitle(null);
    }

    function handleDisciplineTitleEdit(name: string) {
        const title = department.titles.find(o => o.name === name);

        setDisciplineTitleOpen(true);
        setSelectedTitle(title);
    }

    function handleDiciplineTitleDelete(name: string) {
        dispatch(trainingDepartmentActions.deleteTrainingDepartmentDisciplinesTitles(name))
    }

    function handleDisciplineTitleDetailsAccept(title: DisciplineTitle) {
        dispatch(trainingDepartmentActions.updateTrainingDepartmentDisciplinesTitles(title));

        setDisciplineTitleOpen(false);
        setSelectedTitle(null);
    }

    function handleDisciplineTitleDetailsCancel() {
        setDisciplineTitleOpen(false);
        setSelectedTitle(null);
    }
    //#endregion

    //#region Users roles in department state
    const [selectedUser, setSelectedUser] = React.useState<User>(null);
    const [selectedRoles, setSelectedRoles] = React.useState<RoleInDepartment[]>([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = React.useState<boolean>(false);

    function handleUserRolesAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setSelectUserRolesDialogOpen(true);
        setSelectedUser(null);
        setSelectedRoles([]);
    }

    function handleUserRolesEdit(userId: number) {
        if(userState.usersLoading === true) return;
        
        const selectedUser = userState.users.find(o => o.id === userId);
        const selectedRolesInDepartmentIds = department.users.filter(o => o.userId === userId).map(o => o.roleInDepartmentId);
        const selectedRolesInDepartment = department.roles.filter(o => selectedRolesInDepartmentIds.includes(o.id));

        setSelectUserRolesDialogOpen(true);
        setSelectedUser(selectedUser);
        setSelectedRoles(selectedRolesInDepartment);
    }

    function handleUserRolesDelete(userId: number) {
        dispatch(trainingDepartmentActions.deleteTrainingDepartmentUser(userId));
    }

    function handleUserRolesInDepartmentClosed(user: User, rolesInDepartment: RoleInDepartment[]) {
        dispatch(trainingDepartmentActions.updateTrainingDepartmentUsers(user, rolesInDepartment));

        setSelectUserRolesDialogOpen(false);
        setSelectedUser(null);
        setSelectedRoles([]);
    }

    function handleUserRolesInDepartmentCanceled() {
        setSelectUserRolesDialogOpen(false);
    }
    //#endregion

    React.useEffect(() => { initialize(); }, [props.match.params]);

    function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(trainingDepartmentActions.getTrainingDepartment(id));
        dispatch(facultyActions.getFaculties({ type: DepartmentType.Faculty }));
        dispatch(userActions.getUsers({}));
    }

    const handleBackClick = () => {
        const { history } = props;
        dispatch(trainingDepartmentActions.clearTrainingDepartmentEditionState());
        history.push(paths.trainingDepartmentsPath);
    }

    const handleSaveClick = async () => {
        dispatch(trainingDepartmentActions.saveTrainingDepartment(department));
    }

    const handleCancelClick = async () => {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(trainingDepartmentActions.getTrainingDepartment(id));
    }

    function handleStudyload() {
        const { history } = props;
        history.push(paths.getDepartmentloadsPath(`${department.id}`));
    }

    const { classes } = props;

    let department: TrainingDepartment = null;
    let departmentUsers: UserRoleInDepartment[] = [];
    if (trainingDepartmentState.trainingDepartmentLoading === false) {
        department = trainingDepartmentState.trainingDepartment;
        departmentUsers = department && department.users || [];
    }

    const disabled = trainingDepartmentState.trainingDepartmentLoading || userState.usersLoading;

    let faculties: Faculty[] = [];
    if (facultyState.facultiesLoading === false) {
        faculties = facultyState.faculties;
    }

    let users: User[] = [];
    if (userState.usersLoading === false) {
        if (!selectedUser) {
            users = userState.users.filter(o => !departmentUsers.map(u => u.userId).includes(o.id));
        } else {
            const usersWithouteSelectedUser = departmentUsers.filter(o => o.id !== selectedUser.id).map(o => o.id);
            users = userState.users.filter(o => !usersWithouteSelectedUser.includes(o.id));
        }
    }

    const isDepartmentExists: boolean = department && Boolean(department.id);

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row" alignItems="center">
                        <Breadcrumbs>
                            <Link color="inherit" onClick={handleBackClick}>Кафедры</Link>
                            <Typography color="textPrimary">{department && department.name || 'Новая кафедра'}</Typography>
                        </Breadcrumbs>
                        <Grid item xs />
                        {isDepartmentExists && (
                            <Tooltip title="Нагрузка кафедры">
                                <span>
                                    <IconButton disabled={disabled} onClick={handleStudyload}>
                                        <BarChart />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={disabled} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton color="primary" disabled={disabled || !trainingDepartmentState.formErrors.isValid} onClick={handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        {trainingDepartmentState.trainingDepartmentLoading && <LinearProgress variant="query" />}
                        <CardContent>
                            <DepartmentDetails
                                department={department}
                                formErrors={trainingDepartmentState.formErrors}
                                disabled={disabled}
                                onDepartmentDetailsChange={handleDepartmentDetailsChange}
                                parentDepartment={department && department.parent || null}
                                parentDepartments={faculties}
                            />
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography>Названия дисциплин</Typography>
                        <Grid item xs />
                        <Tooltip title="Добавить наименование дисциплин">
                            <span>
                                <IconButton onClick={handleDisciplineTitleAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <DisciplinesTitles
                                    disciplinesTitles={department && department.titles || []}
                                    handleDelete={handleDiciplineTitleDelete}
                                    handleEdit={handleDisciplineTitleEdit}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography className={classes.heading}>Сотрудники</Typography>
                        <Grid item xs />
                        <Tooltip title="Редактировать сотрудников подразделения">
                            <span>
                                <IconButton onClick={handleUserRolesAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <UsersRolesInDepartment
                                    departmentType={department && department.type || DepartmentType.TrainingDepartment}
                                    departmentRoles={department && department.roles || []}
                                    departmentUsers={department && department.users || []}
                                    handleUserRolesDelete={handleUserRolesDelete}
                                    handleUserRolesEdit={handleUserRolesEdit}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography className={classes.heading}>Направления подготовки</Typography>
                        <Grid item xs />
                        <Tooltip title="Добавить направление подготовки">
                            <span>
                                <IconButton onClick={handleStudyDirectionAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <StudyDirections
                                    studyDirections={department && department.studyDirections || []}
                                    handleStudyDirectionDelete={handleStudyDirectionDelete}
                                    handleStudyDirectionEdit={handleStudyDirectionEdit}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography className={classes.heading}>Учебные группы</Typography>
                        <Grid item xs />
                        <Tooltip title="Добавить группу">
                            <span>
                                <IconButton onClick={handleGroupAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <StudentGroups
                                    studentGroups={department && department.groups || []}
                                    handleDelete={handleGroupDelete}
                                    handleEdit={handleGroupEdit}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <UserRolesInDepartmentDetails
                    open={selectUserRolesDialogOpen}
                    selectedUser={selectedUser}
                    selectedRoles={selectedRoles}
                    rolesInDepartment={department && department.roles || []}
                    users={users}
                    onClose={handleUserRolesInDepartmentClosed}
                    onCancel={handleUserRolesInDepartmentCanceled}
                />
                <StudyDirectionDetails
                    onAccept={handleStudyDirectionDetailsAccept}
                    onCancel={handleStudyDirectionDetailsCancel}
                    open={studyDirectionDetailsOpen}
                    selectedDirection={selectedStudyDirection}
                />
                <StudentGroupDetails
                    studyDirections={department && department.studyDirections || []}
                    open={studentGroupOpen}
                    selectedGroup={selectedStudentGroup}
                    onCancel={handleStudentGroupDetailsCancel}
                    onAccept={handleStudentGroupDetailsAccept}
                />
                <DisciplineTitleDetails
                    disciplineTitle={selectedTitle}
                    open={disciplineTitleOpen}
                    onAccept={handleDisciplineTitleDetailsAccept}
                    onCancel={handleDisciplineTitleDetailsCancel}
                />
            </Grid>
        </form >
    );
})); 