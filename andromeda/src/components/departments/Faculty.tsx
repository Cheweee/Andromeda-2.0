import * as React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import clsx from "clsx";
import { WithStyles, withStyles } from "@material-ui/core/styles";
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
    RoleInDepartment,
    UserRoleInDepartment
} from "../../models";

import { departmentService, userService } from "../../services";

import { MessageSnackbar } from "../common";
import { DepartmentDetails } from "./DepartmentDetails";
import { UsersRolesInDepartment, UserRolesInDepartmentDetails } from "./UsersRolesInDepartments";
import { ChildDepartments } from "./ChildDepartments";
import { SnackbarVariant } from "../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const FacultyComponent = withStyles(styles)(withRouter(function (props: Props) {
    const [department, setDepartment] = useState<Faculty>(Faculty.initial);
    const [facultyDepartments, setFacultyDepartments] = useState<TrainingDepartment[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [formErrors, setFormErrors] = useState<DepartmentValidation>(DepartmentValidation.initial);
    const [selectedUser, setSelectedUser] = useState<User>(null);
    const [selectedRoles, setSelectedRoles] = useState<RoleInDepartment[]>([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

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
                //setSnackbar(error.message, true, SnackbarVariant.error);
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
            //setSnackbar('Факультет успешно сохранен', true, SnackbarVariant.success);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                //setSnackbar(error.message, true, SnackbarVariant.error);
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
        const selectedUser = allUsers.find(o => o.id === userId);
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
        const usersWithoutSelectedUser = allUsers.filter(o => o.id !== selectedUser.id).map(o => o.id);
        usersForDialog = allUsers.filter(o => !usersWithoutSelectedUser.includes(o.id));
    }

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row">
                        <Tooltip title="Вернуться назад">
                            <span>
                                <IconButton disabled={loading} onClick={handleBackClick}>
                                    <ArrowBack />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={loading} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton color="primary" disabled={loading || !formErrors.isValid} onClick={handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </span>
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
                                        <span>
                                            <IconButton onClick={handleUserRolesAdd}>
                                                <Add />
                                            </IconButton>
                                        </span>
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