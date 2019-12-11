import * as React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import clsx from "clsx";
import { WithStyles, withStyles } from "@material-ui/styles";
import { ArrowBack, Close, Check, ExpandMore, Add } from "@material-ui/icons";
import {
    Grid,
    Tooltip,
    IconButton,
    Card,
    CardHeader,
    LinearProgress,
    CardContent,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography
} from "@material-ui/core";

import { commonStyles } from "../../muiTheme";
import { mergeStyles, getShortening } from "../../utilities";
import { paths } from "../../sharedConstants";
import {
    Faculty,
    DepartmentValidation,
    ApplicationError,
    DepartmentType,
    TrainingDepartment,
    User,
    RoleInDepartment
} from "../../models";

import { departmentService, userService } from "../../services";

import { MessageSnackbar } from "../common";
import { DepartmentDetails } from "./DepartmentDetails";
import { UsersRolesInDepartment, UserRolesInDepartmentDetails } from "./UsersRolesInDepartments";
import { ChildDepartments } from "./ChildDepartments";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

const initialDepartment: Faculty = {
    id: null,
    type: DepartmentType.Faculty,
    fullName: '',
    name: '',

    users: [],
    roles: [],
};

const initialFormErrors: DepartmentValidation = { isValid: false };

export const FacultyComponent = withStyles(styles)(withRouter(function (props: Props) {
    const [department, setDepartment] = useState(initialDepartment);
    const [facultyDepartments, setFacultyDepartments] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState(undefined);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => { loadDepartment(); }, [props.match.params]);

    useEffect(() => { loadFacultyUsersAndDepartments(); }, [props.match.params]);

    useEffect(() => {
        const formErrors = departmentService.validateFaculty(department);
        setFormErrors(formErrors);
    }, [department]);

    const loadDepartment = async () => {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        try {
            setLoading(true);
            let department: Faculty;
            const id = parseInt(tempId, 0);
            let facultyDepartments: TrainingDepartment[] = [];
            if (id) {
                const models = await departmentService.getFaculties({
                    id,
                    type: DepartmentType.Faculty
                });
                facultyDepartments = await departmentService.getTrainingDepartments({
                    parentId: id,
                    type: DepartmentType.TrainingDepartment
                });
                department = models[0];
            }
            else {
                department = {
                    name: '',
                    fullName: '',
                    type: DepartmentType.Faculty,

                    users: [],
                    roles: []
                };
            }
            setDepartment(department);
            setFacultyDepartments(facultyDepartments)
            setLoading(false);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbarMessage(error.message);
                setSnackbarOpen(true);
                setSnackbarVariant("error");
            }
        }
    }

    const loadFacultyUsersAndDepartments = async () => {
        setLoading(true);

        const allUsers = await userService.get({});

        const facultyDepartments = await departmentService.getTrainingDepartments({ type: DepartmentType.TrainingDepartment, parentId: department.id });
        setAllUsers(allUsers);
        setFacultyDepartments(facultyDepartments);
        setLoading(false);
    }

    const handleSnackbarClose = () => {
        setSnackbarMessage('');
        setSnackbarOpen(false);
        setSnackbarVariant(undefined);
    }

    const handleBackClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        const { history } = props;
        history.push(paths.facultiesPath);
    }

    const handleSaveClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        try {
            setLoading(true);
            if (department.id)
                await departmentService.update(department);
            else
                await departmentService.create(department);
            setLoading(false);
            setSnackbarMessage('Факультет успешно сохранен');
            setSnackbarOpen(true);
            setSnackbarVariant("success");
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbarMessage(error.message);
                setSnackbarOpen(true);
                setSnackbarVariant("error");
            }
        }
    }

    const handleCancelClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        await loadDepartment();
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target && event.target.value;
        setDepartment({ ...department, name });
    }

    const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fullName = event.target && event.target.value;
        const name = getShortening(fullName);

        setDepartment({ ...department, fullName, name });
    }

    const handleUserRolesAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setSelectUserRolesDialogOpen(true);
    }

    const handleUserRolesEdit = (userId: number) => {
        const selectedUser = users.find(o => o.id === userId);
        const selectedRolesInDepartmentIds = department.users.filter(o => o.userId === userId).map(o => o.roleInDepartmentId);
        const selectedRolesInDepartment = department.roles.filter(o => selectedRolesInDepartmentIds.includes(o.id));

        setSelectUserRolesDialogOpen(true);
        setSelectedUser(selectedUser);
        setSelectedRoles(selectedRolesInDepartment);
    }

    const handleUserRolesDelete = (userId: number) => {
        const selectedUser = users.find(o => o.id === userId);
        const usersRoles = department.users.filter(o => o.userId !== selectedUser.id);

        setDepartment({ ...department, users: usersRoles });
    }

    const handleUserRolesInDepartmentClosed = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const usersRoles = department.users.filter(o => o.userId !== user.id);

        for (const role of rolesInDepartment) {
            usersRoles.push({
                roleId: role.roleId,
                roleInDepartmentId: role.id,
                departmentName: department.fullName,
                roleName: role.roleName,
                userFullName: `${user.firstname}${(user.secondname ? ' ' + user.secondname : '')} ${user.lastname}`,
                userId: user.id
            })
        }

        setSelectUserRolesDialogOpen(false);
        setSelectedUser(null);
        setSelectedRoles([]);
        setDepartment({ ...department, users: usersRoles });
    }

    const handleUserRolesInDepartmentCanceled = () => {
        setSelectUserRolesDialogOpen(false);
    }

    const { classes } = props;

    const roles = department.roles || [];
    const users = department.users || [];

    let usersForDialog = [];
    if (!selectedUser) {
        usersForDialog = allUsers.filter(o => !users.map(u => u.userId).includes(o.id));
    } else {
        const usersWithoutSelectedUser = allUsers.filter(o => o.userId !== selectedUser.id).map(o => o.userId);
        usersForDialog = allUsers.filter(o => !usersWithoutSelectedUser.includes(o.id));
    }

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row">
                        <Tooltip title="Вернуться назад">
                            <IconButton disabled={loading} onClick={handleBackClick}>
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <IconButton disabled={loading} onClick={handleCancelClick}>
                                <Close />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <IconButton color="primary" disabled={loading || !formErrors.isValid} onClick={handleSaveClick}>
                                <Check />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardHeader
                            title="Факультет"
                        />
                        {loading && <LinearProgress variant="query" />}
                        <CardContent>
                            <DepartmentDetails
                                department={department}
                                disabled={loading}
                                formErrors={formErrors}
                                handleFullNameChange={handleFullNameChange}
                                handleNameChange={handleNameChange}
                            />
                        </CardContent>
                    </Card>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMore />}
                            >
                                <Typography className={classes.heading}>Кафедры</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <ChildDepartments
                                    childDepartments={facultyDepartments}
                                    departmentType={department.type}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Grid container direction="row" alignItems="center">
                                    <Typography className={classes.heading}>Сотрудники</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Редактировать подразделения роли">
                                        <IconButton onClick={handleUserRolesAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <UsersRolesInDepartment
                                    departmentRoles={roles}
                                    departmentUsers={users}
                                    departmentType={department.type}
                                    handleUserRolesDelete={handleUserRolesDelete}
                                    handleUserRolesEdit={handleUserRolesEdit}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <MessageSnackbar
                    variant={snackbarVariant}
                    message={snackbarMessage}
                    open={snackbarOpen}
                    onClose={handleSnackbarClose}
                />
                <UserRolesInDepartmentDetails
                    open={selectUserRolesDialogOpen}
                    selectedUser={selectedUser}
                    selectedRoles={selectedRoles}
                    rolesInDepartment={department.roles}
                    users={usersForDialog}
                    onClose={handleUserRolesInDepartmentClosed}
                    onCancel={handleUserRolesInDepartmentCanceled}
                />
            </Grid>
        </form >
    );
}));