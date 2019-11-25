import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import { TrainingDepartment, DepartmentValidation, ApplicationError, DepartmentType, Faculty, User, RoleInDepartment } from "../../models";
import { paths } from "../../sharedConstants";
import { departmentService, userService } from "../../services";
import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { SelectUserRoleInDepartment } from "./SelectUserRoleInDepartment";
import { WithStyles, withStyles } from "@material-ui/styles";
import { ArrowBack, Close, Check, ExpandMore, Add } from "@material-ui/icons";
import {
    Grid,
    Tooltip,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    LinearProgress,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails
} from "@material-ui/core";
import { UsersRolesInDepartment } from "./UsersRolesInDepartment";
import { useState, useEffect } from "react";
import { DepartmentDetails } from "./DepartmentDetails";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }


const initialDepartment: TrainingDepartment = {
    type: DepartmentType.TrainingDepartment,
    fullName: '',
    name: '',
    parent: null,

    departmentRoles: [],
    departmentUsers: []
};

const initialFormErrors: DepartmentValidation = { isValid: false };

export const TrainingDepartmentComponent = withStyles(styles)(withRouter(function (props: Props) {
    const [department, setDepartment] = useState(initialDepartment);
    const [faculties, setFaculties] = useState([]);
    const [users, setUsers] = useState([]);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState(undefined);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => { loadDepartment(); }, [props.match.params]);

    useEffect(() => { loadDepartmentUsersAndFaculties(); }, [props.match.params])

    useEffect(() => {
        const formErrors = departmentService.validateTrainingDepartment(department);
        setFormErrors(formErrors);
    }, [department]);

    const loadDepartment = async () => {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        try {
            setLoading(true);
            let department: TrainingDepartment;
            const id = parseInt(tempId, 0);
            if (id) {
                const models = await departmentService.getTrainingDepartments({
                    id,
                    type: DepartmentType.TrainingDepartment
                });
                department = models[0];
            }
            else {
                department = {
                    name: '',
                    fullName: '',
                    type: DepartmentType.TrainingDepartment,
                    parent: null,

                    departmentRoles: [],
                    departmentUsers: []
                }
            }

            setDepartment(department);
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

    const loadDepartmentUsersAndFaculties = async () => {
        setLoading(true);

        const users = await userService.get({});
        const faculties = await departmentService.getFaculties({ type: DepartmentType.Faculty });

        setUsers(users);
        setFaculties(faculties);
        setLoading(false);
    }

    const handleSnackbarClose = () => {
        setSnackbarMessage('');
        setSnackbarOpen(false);
        setSnackbarVariant(undefined);
    }

    const handleBackClick = () => {
        const { history } = props;
        history.push(paths.trainingDepartmentsPath);
    }

    const handleSaveClick = async () => {
        try {
            setLoading(true);
            if (department.id)
                await departmentService.update(department);
            else
                await departmentService.create(department);
            setLoading(false);
            setSnackbarMessage('Кафедра успешно сохранена');
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

    const handleCancelClick = async () => {
        await loadDepartment();
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target && event.target.value;
        setDepartment({ ...department, name });
    }

    const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fullName = event.target && event.target.value;
        const name = departmentService.getNameFromFullName(fullName);
        setDepartment({ ...department, fullName, name });
    }

    const handleFacultyChange = (event: React.ChangeEvent, value: Faculty) => {
        if (value)
            setDepartment({ ...department, parentId: value.id, parent: value });
        else
            setDepartment({ ...department, parentId: null, parent: null });
    }

    const handleUserRolesAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setSelectUserRolesDialogOpen(true);
        setSelectedUser(null);
        setSelectedRoles([]);
    }

    const handleUserRolesEdit = (userId: number) => {
        const selectedUser = users.find(o => o.id === userId);
        const selectedRolesInDepartmentIds = department.departmentUsers.filter(o => o.userId === userId).map(o => o.roleInDepartmentId);
        const selectedRolesInDepartment = department.departmentRoles.filter(o => selectedRolesInDepartmentIds.includes(o.id));

        setSelectUserRolesDialogOpen(true);
        setSelectedUser(selectedUser);
        setSelectedRoles(selectedRolesInDepartment);
    }

    const handleUserRolesDelete = (userId: number) => {
        const selectedUser = users.find(o => o.id === userId);
        const departmentUsersRoles = department.departmentUsers.filter(o => o.userId !== selectedUser.id);

        setDepartment({ ...department, departmentUsers: departmentUsersRoles });
    }

    const handleUserRolesInDepartmentClosed = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const departmentUsersRoles = department.departmentUsers.filter(o => o.userId !== user.id);

        for (const role of rolesInDepartment) {
            departmentUsersRoles.push({
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
        setDepartment({ ...department, departmentUsers: departmentUsersRoles });
    }

    const handleUserRolesInDepartmentCanceled = () => {
        setSelectUserRolesDialogOpen(false);
    }

    const { classes } = props;

    const departmentUsers = department.departmentUsers || [];
    const departmentRoles = department.departmentRoles || [];

    let usersForDialog = [];
    if (!selectedUser) {
        usersForDialog = users.filter(o => !departmentUsers.map(u => u.userId).includes(o.id));
    } else {
        const departmentUsersWithoutSelectedUser = departmentUsers.filter(o => o.userId !== selectedUser.id).map(o => o.userId);
        usersForDialog = users.filter(o => !departmentUsersWithoutSelectedUser.includes(o.id));
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
                        <CardHeader title="Кафедра" />
                        {loading && <LinearProgress variant="query" />}
                        <CardContent>
                            <DepartmentDetails
                                department={department}
                                formErrors={formErrors}
                                disabled={loading}
                                handleParentChange={handleFacultyChange}
                                handleFullNameChange={handleFullNameChange}
                                handleNameChange={handleNameChange}
                                parentDepartments={faculties}
                            />
                        </CardContent>
                    </Card>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Grid container direction="row" alignItems="center">
                                    <Typography className={classes.heading}>Сотрудники</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Редактировать сотрудников подразделения">
                                        <IconButton onClick={handleUserRolesAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <UsersRolesInDepartment
                                    departmentType={department.type}
                                    departmentRoles={departmentRoles}
                                    departmentUsers={departmentUsers}
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
                <SelectUserRoleInDepartment
                    open={selectUserRolesDialogOpen}
                    selectedUser={selectedUser}
                    selectedRoles={selectedRoles}
                    rolesInDepartment={department.departmentRoles}
                    users={usersForDialog}
                    onClose={handleUserRolesInDepartmentClosed}
                    onCancel={handleUserRolesInDepartmentCanceled}
                />
            </Grid>
        </form >
    );
}));