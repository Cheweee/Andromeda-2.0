import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { commonStyles } from "../../muiTheme";
import { mergeStyles, distinct } from "../../utilities";
import { TrainingDepartment, DepartmentValidation, ApplicationError, DepartmentType, Faculty, User, RoleInDepartment } from "../../models";
import { paths } from "../../sharedConstants";
import { departmentService, userService } from "../../services";
import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { SelectUserRoleInDepartment } from "../departments";
import { WithStyles, withStyles } from "@material-ui/styles";
import { ArrowBack, Close, Check, ExpandMore, Edit, Add, Delete } from "@material-ui/icons";
import {
    Grid,
    Tooltip,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    LinearProgress,
    TextField,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    department: TrainingDepartment;
    faculties: Faculty[];
    users: User[];
    formErrors: DepartmentValidation;
    selectedUser: User;
    selectedRoles: RoleInDepartment[];
    loading: boolean;
    selectUserRolesDialogOpen: boolean;
    snackbarOpen: boolean;
    snackbarVariant: "success" | "error";
    snackbarMessage: string;
}

class TrainingDepartmentBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            department: {
                type: DepartmentType.TrainingDepartment,
                fullName: '',
                name: '',
                parent: null,

                departmentRoles: [],
                departmentUsers: []
            },
            faculties: [],
            users: [],
            formErrors: { isValid: false },
            selectedUser: null,
            selectedRoles: [],
            loading: false,
            selectUserRolesDialogOpen: false,
            snackbarOpen: false,
            snackbarVariant: undefined,
            snackbarMessage: ''
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });

        const users = await userService.get({});

        const faculties = await departmentService.getFaculties({ type: DepartmentType.Faculty });
        this.setState({ users, faculties });
        await this.loadTrainingDepartment();
    }

    private loadTrainingDepartment = async () => {
        const {
            match
        } = this.props;

        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, 0);

        try {
            this.setState({
                loading: true
            });
            let department: TrainingDepartment;

            if (id) {
                const models = await departmentService.getTrainingDepartments({
                    id,
                    type: DepartmentType.TrainingDepartment
                });
                const model = models[0];
                department = model;
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

            this.setState({
                department,
                loading: false
            }, this.validateDepartment);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                this.setState({
                    loading: false,
                    snackbarMessage: error.message,
                    snackbarOpen: true,
                    snackbarVariant: "error"
                })
            }
        }
    }

    private validateDepartment = () => {
        const {
            department
        } = this.state;
        const formErrors = departmentService.validateTrainingDepartment(department);
        this.setState({
            formErrors
        })
    }

    private handleSnackbarClose = () => {
        this.setState({
            snackbarMessage: '',
            snackbarOpen: false,
            snackbarVariant: undefined
        })
    }

    private handleBackClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            history
        } = this.props;
        history.push(paths.trainingDepartmentsPath);
    }

    private handleSaveClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            department
        } = this.state;

        try {
            this.setState({
                loading: true
            });
            if (department.id)
                await departmentService.update(department);
            else
                await departmentService.create(department);
            this.setState({
                loading: false,
                snackbarMessage: 'Кафедра успешно сохранена',
                snackbarOpen: true,
                snackbarVariant: "success"
            });
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                this.setState({
                    loading: false,
                    snackbarMessage: error.message,
                    snackbarOpen: true,
                    snackbarVariant: "error"
                })
            }
        }
    }

    private handleCancelClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        await this.loadTrainingDepartment();
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { department: department } = this.state;
        const name = event.target && event.target.value;

        this.setState({
            department: { ...department, name },
        }, this.validateDepartment);
    }

    private handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { department: department } = this.state;
        const fullName = event.target && event.target.value;
        const name = departmentService.getNameFromFullName(fullName);

        this.setState({
            department: { ...department, fullName, name },
        }, this.validateDepartment);
    }

    private handleFacultyChange = (event: React.ChangeEvent, value: Faculty) => {
        const { department } = this.state;
        if (value)
            this.setState({ department: { ...department, parentId: value.id, parent: value } }, this.validateDepartment);
        else
            this.setState({ department: { ...department, parentId: null, parent: null } }, this.validateDepartment);
    }

    private handleUserRolesAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        this.setState({ selectUserRolesDialogOpen: true });
    }

    private handleUserRolesEdit = (event: React.MouseEvent<Element, MouseEvent>, userId: number) => {
        event.stopPropagation();
        const {
            users,
            department
        } = this.state;

        const selectedUser = users.find(o=> o.id === userId);
        const selectedRolesInDepartmentIds = department.departmentUsers.filter(o=> o.userId === userId).map(o=> o.roleInDepartmentId);
        const selectedRolesInDepartment = department.departmentRoles.filter(o=> selectedRolesInDepartmentIds.includes(o.id));

        this.setState({
            selectUserRolesDialogOpen: true,
            selectedUser,
            selectedRoles : selectedRolesInDepartment
        })
    }

    private handleUserRolesInDepartmentCanceled = () => {
        this.setState({
            selectUserRolesDialogOpen: false
        });
    }

    private handleUserRolesInDepartmentAdded = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const { department } = this.state;

        const departmentUsersRoles = department.departmentUsers;
        for (const role of rolesInDepartment) {
            departmentUsersRoles.push({
                roleId: role.roleId,
                roleInDepartmentId: role.id,
                departmentName: department.fullName,
                roleName: role.roleName,
                userFullName: user.firstname + ' ' + user.secondname + ' ' + user.lastname,
                userId: user.id
            })
        }

        this.setState({
            selectUserRolesDialogOpen: false,
            selectedUser: null,
            selectedRoles: [],
            department: { ...department, departmentUsers: departmentUsersRoles }
        });
    }

    private handleUserRolesInDepartmentEdited = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const { department } = this.state;

        const departmentUsersRoles = department.departmentUsers;
        const userRolesInDepartment = department.departmentUsers.filter(o => o.userId === user.id);
        for (const role of rolesInDepartment) {
            for (const userRoleInDepartment of userRolesInDepartment) {
                userRoleInDepartment.roleId = role.roleId;
                userRoleInDepartment.roleInDepartmentId = role.id;
                userRoleInDepartment.departmentName = department.fullName;
                userRoleInDepartment.roleName = role.roleName;
                userRoleInDepartment.userFullName = user.firstname + (user.secondname ? ' ' + user.secondname : '') + ' ' + user.lastname;
                userRoleInDepartment.userId = user.id;
            }
        }

        this.setState({
            selectUserRolesDialogOpen: false,
            department: { ...department, departmentUsers: departmentUsersRoles }
        });
    }

    render() {
        const { classes } = this.props;
        const {
            department,
            faculties,
            users,
            selectedUser,
            selectedRoles,
            loading,
            selectUserRolesDialogOpen,
            formErrors,
            snackbarOpen,
            snackbarVariant,
            snackbarMessage
        } = this.state;

        const faculty = department.parent;

        const departmentUsers = department.departmentUsers || [];
        const departmentRoles = department.departmentRoles || [];

        const usersDictionary = [];
        for (const user of departmentUsers) {
            if (usersDictionary.find(o => o.userName === user.userFullName))
                continue;

            const roleIds = departmentUsers.filter(o => o.userId === user.userId).map(o => o.roleId);

            const newUser = {
                userId: user.userId,
                userName: user.userFullName,
                roleIds: roleIds
            };
            usersDictionary.push(newUser);
        }

        for (const user of usersDictionary) {
            if (user.roleIds) {
                const roleNames = departmentRoles
                    .filter(o => user.roleIds.includes(o.roleId))
                    .map(o => o.roleName)
                    .reduce((previous: string, current: string) => (previous ? (previous + '; ') : '') + current, '');
                user.roleNames = roleNames;
            }
        }

        const listItems = usersDictionary.map(user => {
            return (
                <ListItem key={user.userId}>
                    <ListItemText primary={user.userName} secondary={user.roleNames} />
                    <ListItemSecondaryAction>
                        <Grid container direction="row">
                            <IconButton onClick={(event) => this.handleUserRolesEdit(event, user.userId)}>
                                <Edit />
                            </IconButton>
                            <IconButton>
                                <Delete />
                            </IconButton>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        });

        return (
            <form autoComplete="off" noValidate>
                <Grid container direction="row">
                    <Grid item xs={2} />
                    <Grid item xs container direction="column">
                        <Grid container direction="row">
                            <Tooltip title="Вернуться назад">
                                <IconButton disabled={loading} onClick={this.handleBackClick}>
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            <Grid item xs />
                            <Tooltip title="Отменить">
                                <IconButton disabled={loading} onClick={this.handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Сохранить">
                                <IconButton color="primary" disabled={loading || !formErrors.isValid} onClick={this.handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            <CardHeader title="Кафедра" />
                            {loading && <LinearProgress variant="query" />}
                            <CardContent>
                                <Grid container direction="column">
                                    <Grid container direction="row">
                                        <Grid item className={classes.margin1X}>
                                            <TextField
                                                id="name"
                                                name="name"
                                                label="Сокращение"
                                                placeholder="Введите сокращение наименования кафедры"
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                autoComplete="firstname"
                                                disabled={loading}
                                                value={department.name}
                                                error={Boolean(formErrors.nameError)}
                                                helperText={formErrors.nameError}
                                                onChange={this.handleNameChange}
                                            />
                                        </Grid>
                                        <Grid item xs className={classes.margin1X}>
                                            <TextField
                                                id="fullname"
                                                name="fullname"
                                                label="Полное наименование"
                                                placeholder="Введите полное наименование кафедры"
                                                margin="normal"
                                                variant="outlined"
                                                autoComplete="fullname"
                                                fullWidth
                                                disabled={loading}
                                                value={department.fullName}
                                                error={Boolean(formErrors.fullNameError)}
                                                helperText={formErrors.fullNameError}
                                                onChange={this.handleFullNameChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row">
                                        <Grid item xs className={classes.margin1X}>
                                            <Autocomplete
                                                options={faculties}
                                                className={classes.w100}
                                                noOptionsText={"Факультет не найден"}
                                                getOptionLabel={(option: Faculty) => option.fullName}
                                                renderOption={(option: Faculty) => (
                                                    <Grid container direction="row">
                                                        <Grid item className={classes.margin1X} xs={2}>{option.name}</Grid>
                                                        <Grid item className={classes.margin1X} xs={9}>{option.fullName}</Grid>
                                                    </Grid>
                                                )}
                                                value={faculty}
                                                onChange={this.handleFacultyChange}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        error={Boolean(formErrors.parentIdError)}
                                                        helperText={formErrors.parentIdError}
                                                        label="Факультет"
                                                        placeholder="Выберите факультет"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={loading}
                                                        value={faculty ? faculty.name : ''}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                    <Grid container direction="row" alignItems="center">
                                        <Typography className={classes.heading}>Сотрудники</Typography>
                                        <Grid item xs />
                                        <Tooltip title="Редактировать подразделения роли">
                                            <IconButton onClick={this.handleUserRolesAdd}>
                                                <Add />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container direction="column">
                                        {departmentUsers.length ?
                                            <List>{listItems}</List>
                                            :
                                            <Grid container direction="row" justify="center">
                                                <Typography color="textSecondary">У данной кафедры еще нет сотрудников</Typography>
                                            </Grid>
                                        }
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Card>
                    </Grid>
                    <Grid item xs={2} />
                    <MessageSnackbar
                        variant={snackbarVariant}
                        message={snackbarMessage}
                        open={snackbarOpen}
                        onClose={this.handleSnackbarClose}
                    />
                    <SelectUserRoleInDepartment
                        open={selectUserRolesDialogOpen}
                        selectedUser={selectedUser}
                        selectedRolesInDepartment={selectedRoles}
                        rolesInDepartment={department.departmentRoles}
                        users={users}
                        onClose={this.handleUserRolesInDepartmentAdded}
                        onCancel={this.handleUserRolesInDepartmentCanceled}
                    />
                </Grid>
            </form>
        );
    }
}

export const TrainingDepartmentComponent = withStyles(styles)(withRouter(TrainingDepartmentBase));