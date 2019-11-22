import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import { Faculty, DepartmentValidation, ApplicationError, DepartmentType, TrainingDepartment, User, RoleInDepartment } from "../../models";
import { paths } from "../../sharedConstants";
import { departmentService, userService } from "../../services";
import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { SelectUserRoleInDepartment } from "../departments";
import { WithStyles, withStyles } from "@material-ui/styles";
import {
    ArrowBack, Close, Check, ExpandMore, Edit
} from "@material-ui/icons";
import { Grid, Tooltip, IconButton, Card, CardHeader, LinearProgress, CardContent, TextField, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, List, ListItem, ListItemText } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    faculty: Faculty;
    users: User[];
    facultyDepartments: TrainingDepartment[];
    formErrors: DepartmentValidation;
    loading: boolean;
    selectUserRolesDialogOpen: boolean;
    snackbarOpen: boolean;
    snackbarVariant: "success" | "error";
    snackbarMessage: string;
}

class FacultyBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            faculty: {
                type: DepartmentType.Faculty,
                fullName: '',
                name: '',
                departmentUsers: [],
                departmentRoles: [],
            },
            facultyDepartments: [],
            users: [],
            formErrors: { isValid: false },
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

        await this.loadFaculty();
    }

    private loadFaculty = async () => {
        const {
            match
        } = this.props;

        const tempId = match.params && match.params[paths.idParameterName];
        try {
            this.setState({
                loading: true
            })
            let faculty: Faculty;
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
                faculty = models[0];
            }
            else {
                faculty = {
                    name: '',
                    fullName: '',
                    type: DepartmentType.Faculty,
                    departmentUsers: [],
                    departmentRoles: []
                };
            }
            this.setState({
                faculty,
                facultyDepartments,
                loading: false
            }, this.validateFaculty);
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

    private validateFaculty = () => {
        const {
            faculty
        } = this.state;
        const formErrors = departmentService.validateFaculty(faculty);
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
        history.push(paths.facultiesPath);
    }

    private handleSaveClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            faculty
        } = this.state;

        try {
            this.setState({
                loading: true
            });
            if (faculty.id)
                await departmentService.update(faculty);
            else
                await departmentService.create(faculty);
            this.setState({
                loading: false,
                snackbarMessage: 'Факультет успешно сохранен',
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
        await this.loadFaculty();
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { faculty } = this.state;
        const name = event.target && event.target.value;

        this.setState({
            faculty: { ...faculty, name },
        }, this.validateFaculty);
    }

    private handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { faculty } = this.state;
        const fullName = event.target && event.target.value;
        const name = departmentService.getNameFromFullName(fullName);

        this.setState({
            faculty: { ...faculty, fullName, name },
        }, this.validateFaculty);
    }

    private handleUserRolesAdd = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        this.setState({ selectUserRolesDialogOpen: true });
    }

    private handleUserRolesInDepartmentAdded = (user: User, rolesInDepartment: RoleInDepartment[]) => {
        const { faculty } = this.state;

        const departmentUsersRoles = faculty.departmentUsers;
        for (const role of rolesInDepartment) {
            departmentUsersRoles.push({
                roleInDepartmentId: role.id,
                departmentName: faculty.fullName,
                roleName: role.roleName,
                userFullName: user.firstname + ' ' + user.secondname + ' ' + user.lastname,
                userId: user.id
            })
        }

        this.setState({
            selectUserRolesDialogOpen: false,
            faculty: { ...faculty, departmentUsers: departmentUsersRoles }
        });
    }

    private handleUserRolesInDepartmentCanceled = () => {
        this.setState({
            selectUserRolesDialogOpen: false
        });
    }

    render() {
        const { classes } = this.props;
        const {
            faculty,
            users,
            facultyDepartments,
            loading,
            selectUserRolesDialogOpen,
            formErrors,
            snackbarOpen,
            snackbarVariant,
            snackbarMessage
        } = this.state;

        const departmentUsers = faculty.departmentUsers || [];

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
                            <CardHeader
                                title="Факультет"
                            />
                            {loading && <LinearProgress variant="query" />}
                            <CardContent>
                                <Grid container direction="column">
                                    <Grid container direction="row">
                                        <Grid item className={classes.margin1X}>
                                            <TextField
                                                id="name"
                                                name="name"
                                                label="Сокращение"
                                                placeholder="Введите сокращение наименования факультета"
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                autoComplete="firstname"
                                                disabled={loading}
                                                value={faculty.name}
                                                onChange={this.handleNameChange}
                                                error={Boolean(formErrors.nameError)}
                                                helperText={formErrors.nameError}
                                            />
                                        </Grid>
                                        <Grid item xs className={classes.margin1X}>
                                            <TextField
                                                id="fullname"
                                                name="fullname"
                                                label="Полное наименование"
                                                placeholder="Введите полное наименование факультета"
                                                margin="normal"
                                                variant="outlined"
                                                autoComplete="fullname"
                                                fullWidth
                                                disabled={loading}
                                                value={faculty.fullName}
                                                error={Boolean(formErrors.fullNameError)}
                                                helperText={formErrors.fullNameError}
                                                onChange={this.handleFullNameChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
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
                                    {facultyDepartments.length ? (
                                        <List>
                                            {facultyDepartments.map(department => (
                                                <ListItem>
                                                    <ListItemText
                                                        key={department.id}
                                                        primary={department.fullName}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                            <Grid container direction="row" justify="center">
                                                <Typography color="textSecondary">Этот факультет еще не имеет кафедр</Typography>
                                            </Grid>
                                        )}
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
                                            <IconButton onClick={this.handleUserRolesAdd}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    {departmentUsers.length ?
                                        <List>
                                            {departmentUsers.map(user =>
                                                <ListItem>
                                                    <ListItemText key={user.id} primary={user.userFullName} />
                                                </ListItem>
                                            )}
                                        </List>
                                        :
                                        <Grid container direction="row" justify="center">
                                            <Typography color="textSecondary">У данной кафедры еще нет сотрудников</Typography>
                                        </Grid>
                                    }
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
                        selectedUser={null}
                        selectedRolesInDepartment={[]}
                        rolesInDepartment={[]}
                        users={users}
                        onClose={this.handleUserRolesInDepartmentAdded}
                        onCancel={this.handleUserRolesInDepartmentCanceled}
                    />
                </Grid>
            </form>
        );
    }
}

export const FacultyComponent = withStyles(styles)(withRouter(FacultyBase));