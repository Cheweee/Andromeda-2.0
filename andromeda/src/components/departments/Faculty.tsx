import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Tooltip, IconButton, Card, CardHeader, LinearProgress, CardContent, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Breadcrumbs, Link } from "@material-ui/core";
import { ArrowBack, Close, Check, ExpandMore, Add } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { Faculty, DepartmentType, TrainingDepartment, User, RoleInDepartment, AppState } from "../../models";

import { DepartmentDetails } from "./DepartmentDetails";
import { UsersRolesInDepartment, UserRolesInDepartmentDetails } from "./UsersRolesInDepartments";
import { ChildDepartments } from "./ChildDepartments";

import { facultyActions } from "../../store/facultyStore";
import { userActions } from "../../store/userStore";
import { trainingDepartmentActions } from "../../store/trainingDepartmentStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const FacultyComponent = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { facultyState, trainingDepartmentState, userState } = Redux.useSelector((state: AppState) => ({
        facultyState: state.facultyState,
        trainingDepartmentState: state.trainingDepartmentState,
        userState: state.userState
    }));

    //#region Faculty state
    function handleFacultyDetailsChange(model: Faculty) {
        dispatch(facultyActions.updateFacultyDetails(model));
    }
    //#endregion

    //#region Users roles in department state
    const [selectedUser, setSelectedUser] = React.useState<User>(null);
    const [selectedRoles, setSelectedRoles] = React.useState<RoleInDepartment[]>([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = React.useState<boolean>(false);
    const [users, setUsers] = React.useState<User[]>();

    function handleUserRolesAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setSelectUserRolesDialogOpen(true);
        setSelectedUser(null);
        setSelectedRoles([]);
    }

    function handleUserRolesEdit(userId: number) {
        const selectedUser = users.find(o => o.id === userId);
        const selectedRolesInDepartmentIds = department.users.filter(o => o.userId === userId).map(o => o.roleInDepartmentId);
        const selectedRolesInDepartment = department.roles.filter(o => selectedRolesInDepartmentIds.includes(o.id));

        setSelectUserRolesDialogOpen(true);
        setSelectedUser(selectedUser);
        setSelectedRoles(selectedRolesInDepartment);
    }

    function handleUserRolesDelete(userId: number) {
        dispatch(facultyActions.deleteFacultyUser(userId));
    }

    function handleUserRolesInDepartmentAccept(user: User, rolesInDepartment: RoleInDepartment[]) {
        dispatch(facultyActions.updateFacultyUsers(user, rolesInDepartment));

        setSelectUserRolesDialogOpen(false);
        setSelectedUser(null);
        setSelectedRoles([]);
    }

    function handleUserRolesInDepartmentCanceled() {
        setSelectUserRolesDialogOpen(false);
        setSelectedUser(null);
        setSelectedRoles([]);
    }
    //#endregion

    React.useEffect(() => { initialize(); }, [props.match.params]);
    React.useEffect(() => {
        if (userState.modelsLoading === true) return;

        const departmentUsers = department && department.users;

        let users: User[] = [];
        if (!selectedUser) {
            users = userState.models.filter(o => !users.map(u => u.id).includes(o.id));
        } else {
            const usersWithoutSelectedUser = departmentUsers.filter(o => o.id !== selectedUser.id).map(o => o.id);
            users = userState.models.filter(o => !usersWithoutSelectedUser.includes(o.id));
        }

        setUsers(users);
    }, [userState.modelsLoading, selectedUser])

    function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(facultyActions.getFaculty(id));
        dispatch(trainingDepartmentActions.getTrainingDepartments({ type: DepartmentType.TrainingDepartment }));
        dispatch(userActions.getUsers({}));
    }

    function handleBackClick() {
        const { history } = props;
        dispatch(facultyActions.clearFacultyEditionState());
        history.push(paths.facultiesPath);
    }

    function handleSaveClick() {
        dispatch(facultyActions.saveFaculty(department));
    }

    function handleCancelClick() {
        dispatch(facultyActions.getFaculty(department.id));
    }

    const { classes } = props;

    let department: Faculty = null;
    let facultyDepartments: TrainingDepartment[] = [];
    if (facultyState.modelLoading === false) {
        department = facultyState.model;
    }
    if (trainingDepartmentState.trainingDepartmentsLoading === false) {
        facultyDepartments = trainingDepartmentState.trainingDepartments.filter(o => department && o.parentId === department.id);
    }

    const disabled = facultyState.modelLoading || userState.modelsLoading || trainingDepartmentState.trainingDepartmentsLoading;

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row" alignItems="center">
                        <Breadcrumbs>
                            <Link color="inherit" onClick={handleBackClick}>Факультеты и институты</Link>
                            <Typography color="textPrimary">{department && department.name || 'Новый факультет'}</Typography>
                        </Breadcrumbs>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={disabled} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton color="primary" disabled={disabled || !facultyState.formErrors.isValid} onClick={handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        {facultyState.modelLoading && <LinearProgress variant="query" />}
                        <CardContent>
                            <DepartmentDetails
                                department={department}
                                disabled={disabled}
                                formErrors={facultyState.formErrors}
                                onDepartmentDetailsChange={handleFacultyDetailsChange}
                            />
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center" className={classes.margin1Y}>
                        <Typography>Кафедры</Typography>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        {trainingDepartmentState.trainingDepartmentsLoading && <LinearProgress variant="query" />}
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <ChildDepartments
                                    childDepartments={facultyDepartments}
                                    departmentType={department && department.type || DepartmentType.Faculty}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography>Сотрудники</Typography>
                        <Grid item xs />
                        <Tooltip title="Редактировать подразделения роли">
                            <span>
                                <IconButton onClick={handleUserRolesAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        {userState.modelsLoading && <LinearProgress variant="query" />}
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <UsersRolesInDepartment
                                    departmentRoles={department && department.roles || []}
                                    departmentUsers={department && department.users || []}
                                    departmentType={department && department.type || DepartmentType.Faculty}
                                    handleUserRolesDelete={handleUserRolesDelete}
                                    handleUserRolesEdit={handleUserRolesEdit}
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
                    onClose={handleUserRolesInDepartmentAccept}
                    onCancel={handleUserRolesInDepartmentCanceled}
                />
            </Grid>
        </form >
    );
}));