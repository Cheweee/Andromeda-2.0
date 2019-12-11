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
    CardContent,
    LinearProgress,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography
} from "@material-ui/core";

import { commonStyles } from "../../muiTheme";
import { mergeStyles, getShortening } from "../../utilities";
import { paths } from "../../sharedConstants";
import {
    TrainingDepartment,
    DepartmentValidation,
    ApplicationError,
    DepartmentType,
    Faculty,
    User,
    RoleInDepartment,
    StudyDirection,
    StudentGroup,
    DisciplineTitle
} from "../../models";

import { departmentService, userService } from "../../services";

import { MessageSnackbar } from "../common";
import { DepartmentDetails } from "./DepartmentDetails";
import { UsersRolesInDepartment, UserRolesInDepartmentDetails } from "./UsersRolesInDepartments";
import { StudentGroups, StudentGroupDetails } from "./StudentGroups";
import { StudyDirections, StudyDirectionDetails } from "./StudyDirections";
import { DisciplineTitleDetails, DisciplinesTitles } from "./DisciplinesTitles";
import { useSnackbarState } from "../../hooks";
import { SnackbarVariant } from "../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

const initialDepartment: TrainingDepartment = {
    type: DepartmentType.TrainingDepartment,
    fullName: '',
    name: '',
    parent: null,

    roles: [],
    users: [],
    studyDirections: [],
    groups: [],
    titles: []
};

const initialFormErrors: DepartmentValidation = { isValid: false };

export const TrainingDepartmentComponent = withStyles(styles)(withRouter(function (props: Props) {
    const [department, setDepartment] = useState(initialDepartment);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [faculties, setFaculties] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    //#region Study direction details state
    const [selectedStudyDirection, setSelectedStudyDirection] = useState(null);
    const [studyDirectionDetailsOpen, setStudyDirectionDetailsOpen] = useState(false);
    //#endregion

    //#region Student group details state
    const [selectedStudentGroup, setSelectedStudentGroup] = useState(null);
    const [studentGroupOpen, setStudentGroupOpen] = useState(false);
    //#endregion

    //#region Discipline title details state
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [disciplineTitleOpen, setDisciplineTitleOpen] = useState(false);
    //#endregion

    //#region Select user role in department state
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectUserRolesDialogOpen, setSelectUserRolesDialogOpen] = useState(false);
    //#endregion

    const [snackbarState, setSnackbarState] = useSnackbarState();

    useEffect(() => { loadDepartment(); }, [props.match.params]);

    useEffect(() => { loadDepartmentUsersAndFaculties(); }, [props.match.params])

    useEffect(() => {
        const formErrors = departmentService.validateTrainingDepartment(department);
        setFormErrors(formErrors);
    }, [department]);

    const loadDepartment = async () => {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        let department: TrainingDepartment = initialDepartment;
        try {
            setLoading(true);
            const id = parseInt(tempId, 0);
            if (id) {
                const models = await departmentService.getTrainingDepartments({
                    id,
                    type: DepartmentType.TrainingDepartment
                });
                department = models[0];
            }

            setDepartment(department);
            setLoading(false);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbarState(error.message, true, SnackbarVariant.error);
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
        setSnackbarState('', false, undefined);
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
            setSnackbarState('Кафедра успешно сохранена', true, SnackbarVariant.success);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbarState(error.message, true, SnackbarVariant.error);
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
        const name = getShortening(fullName);
        setDepartment({ ...department, fullName, name });
    }

    const handleFacultyChange = (event: React.ChangeEvent, value: Faculty) => {
        if (value)
            setDepartment({ ...department, parentId: value.id, parent: value });
        else
            setDepartment({ ...department, parentId: null, parent: null });
    }

    const handleGroupAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setStudentGroupOpen(true);
        setSelectedStudentGroup(null);
    }

    const handleGroupEdit = (id: number) => {
        const group = department.groups.find(o => o.id === id);

        setStudentGroupOpen(true);
        setSelectedStudentGroup(group);
    }

    const handleGroupDelete = (id: number) => {
        const groups = department.groups.filter(o => o.id !== id);

        setDepartment({ ...department, groups });
    }

    const handleUserRolesAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setSelectUserRolesDialogOpen(true);
        setSelectedUser(null);
        setSelectedRoles([]);
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
        const departmentUsersRoles = department.users.filter(o => o.userId !== selectedUser.id);

        setDepartment({ ...department, users: departmentUsersRoles });
    }

    const handleUserRolesInDepartmentClosed = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const departmentUsersRoles = department.users.filter(o => o.userId !== user.id);

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
        setDepartment({ ...department, users: departmentUsersRoles });
    }

    const handleUserRolesInDepartmentCanceled = () => {
        setSelectUserRolesDialogOpen(false);
    }

    const handleStudyDirectionAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setStudyDirectionDetailsOpen(true);
        setSelectedStudyDirection(null);
    }

    const handleStudyDirectionEdit = (id: number) => {
        const selectedDirection = department.studyDirections.find(o => o.id === id);

        setStudyDirectionDetailsOpen(true);
        setSelectedStudyDirection({ ...selectedDirection });
    }

    const handleStudyDirectionDelete = (id: number) => {
        const directions = department.studyDirections.filter(o => o.id != id);
        setDepartment({ ...department, studyDirections: directions });
    }

    const handleStudyDirectionDetailsCancel = () => {
        setStudyDirectionDetailsOpen(false);
        setSelectedStudyDirection(null);
    }

    const handleStudyDirectionDetailsAccept = (direction: StudyDirection) => {
        let newDirection = department.studyDirections.find(o => o.name === direction.name && o.id === direction.id);
        if (newDirection) {
            newDirection.code = direction.code;
            newDirection.name = direction.name;
            newDirection.shortName = direction.shortName;
            newDirection.departmentId = department.id;
        } else {
            newDirection = {
                code: direction.code,
                name: direction.name,
                shortName: direction.shortName,
                departmentId: department.id
            };
            department.studyDirections.push(newDirection);
        }

        setStudyDirectionDetailsOpen(false);
        setSelectedStudyDirection(null);
    }

    const handleStudentGroupDetailsCancel = () => {
        setStudentGroupOpen(false);
        setSelectedStudentGroup(null);
    }

    const handleStudentGroupDetailsAccept = (group: StudentGroup) => {
        let newGroup = department.groups.find(o => o.name === group.name);
        if (newGroup) {
            newGroup.currentCourse = group.currentCourse;
            newGroup.name = group.name;
            newGroup.startYear = group.startYear;
            newGroup.studentsCount = group.studentsCount;
            newGroup.studyDirectionId = group.studyDirectionId;
            newGroup.studyLoadId = group.studyLoadId;
        } else {
            newGroup = {
                currentCourse: group.currentCourse,
                name: group.name,
                startYear: group.startYear,
                studentsCount: group.studentsCount,
                studyDirectionId: group.studyDirectionId,
                studyDirection: group.studyDirection,
                departmentId: department.id
            };

            department.groups.push(newGroup);
        }

        setStudentGroupOpen(false);
        setSelectedStudentGroup(null);
    }

    const handleDisciplineTitleAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        setDisciplineTitleOpen(true);
        setSelectedTitle(null);
    }

    const handleDisciplineTitleEdit = (id: number) => {
        const title = department.titles.find(o => o.id === id);

        setDisciplineTitleOpen(true);
        setSelectedTitle(title);
    }

    const handleDiciplineTitleDelete = (id: number) => {
        const titles = department.titles.filter(o => o.id !== id);

        setDepartment({ ...department, titles });
    }

    const handleDisciplineTitleDetailsCancel = () => {
        setDisciplineTitleOpen(false);
        setSelectedTitle(null);
    }

    const handleDisciplineTitleDetailsAccept = (title: DisciplineTitle) => {
        let newTitle = department.titles.find(o => o.id === title.id);
        if (newTitle) {
            newTitle.name = title.name;
            newTitle.shortname = title.shortname;
        } else {
            newTitle = {
                shortname: title.shortname,
                name: title.name
            };

            department.titles.push(newTitle);
        }

        setDisciplineTitleOpen(false);
        setSelectedTitle(null);
    }

    const { classes } = props;

    const departmentUsers = department.users || [];
    const departmentRoles = department.roles || [];

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
                                    <Typography className={classes.heading}>Названия дисциплин</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Добавить наименование дисциплин">
                                        <IconButton onClick={handleDisciplineTitleAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <DisciplinesTitles
                                    disciplinesTitles={department.titles}
                                    handleDelete={handleDiciplineTitleDelete}
                                    handleEdit={handleDisciplineTitleEdit}
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
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Grid container direction="row" alignItems="center">
                                    <Typography className={classes.heading}>Направления подготовки</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Добавить направление подготовки">
                                        <IconButton onClick={handleStudyDirectionAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <StudyDirections
                                    studyDirections={department.studyDirections}
                                    handleStudyDirectionDelete={handleStudyDirectionDelete}
                                    handleStudyDirectionEdit={handleStudyDirectionEdit}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Grid container direction="row" alignItems="center">
                                    <Typography className={classes.heading}>Учебные группы</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Добавить группу">
                                        <IconButton onClick={handleGroupAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <StudentGroups
                                    studentGroups={department.groups}
                                    handleDelete={handleGroupDelete}
                                    handleEdit={handleGroupEdit}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <MessageSnackbar
                    variant={snackbarState.variant}
                    message={snackbarState.message}
                    open={snackbarState.open}
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
                <StudyDirectionDetails
                    onAccept={handleStudyDirectionDetailsAccept}
                    onCancel={handleStudyDirectionDetailsCancel}
                    open={studyDirectionDetailsOpen}
                    selectedDirection={selectedStudyDirection}
                />
                <StudentGroupDetails
                    studyDirections={department.studyDirections}
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