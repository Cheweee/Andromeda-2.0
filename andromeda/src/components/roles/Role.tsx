import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { WithStyles, withStyles } from "@material-ui/styles";
import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import { Role, RoleValidation, ApplicationError, DepartmentType, Department, RoleInDepartment } from "../../models";
import { paths } from "../../sharedConstants";
import { roleService, departmentService } from "../../services";
import {
    Grid,
    Tooltip,
    IconButton,
    Card,
    CardHeader,
    LinearProgress,
    CardContent,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ListSubheader,
    Dialog,
    DialogTitle,
    DialogContent,
    InputBase
} from "@material-ui/core";
import { ArrowBack, Close, Check, Add, Delete, ExpandMore, Search, Edit } from "@material-ui/icons";
import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { SelectDepartmentDialog } from "../departments";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    role: Role;
    allDepartments: Department[];
    formErrors: RoleValidation;
    selectDepartmentsDialogOpen: boolean;
    loading: boolean;
    snackbarOpen: boolean;
    snackbarVariant: "success" | "error";
    snackbarMessage: string;
}

class RoleBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            role: {
                name: '',
                roleDepartments: []
            },
            allDepartments: [],
            formErrors: { isValid: false },
            loading: false,
            selectDepartmentsDialogOpen: false,
            snackbarOpen: false,
            snackbarVariant: undefined,
            snackbarMessage: ''
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        const allDepartments = await departmentService.getDepartments({});
        this.setState({
            allDepartments
        });
        await this.loadRole();
    }

    private loadRole = async () => {
        const {
            match
        } = this.props;

        const tempId = match.params && match.params[paths.idParameterName];
        try {
            this.setState({
                loading: true
            });
            let role: Role;
            const id = parseInt(tempId, 0);
            if (id) {
                const models = await roleService.getFaculties({
                    id,
                });
                const model = models[0];
                role = {
                    id: model.id,
                    name: model.name,
                    roleDepartments: model.roleDepartments || []
                };
            }
            else {
                role = {
                    name: '',
                    roleDepartments: []
                };
            }
            this.setState({
                role,
                loading: false
            }, this.validateRole);
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

    private validateRole = () => {
        const {
            role
        } = this.state;
        const formErrors = roleService.validateRole(role);
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
        history.push(paths.rolesPath);
    }

    private handleSaveClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            role
        } = this.state;

        try {
            this.setState({
                loading: true
            });
            if (role.id)
                await roleService.update(role);
            else
                await roleService.create(role);
            this.setState({
                loading: false,
                snackbarMessage: 'Роль успешно сохранена',
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
        await this.loadRole();
    }

    private handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { role } = this.state;
        const name = event.target && event.target.value;

        this.setState({
            role: { ...role, name },
        }, this.validateRole);
    }

    private handleAddDepartment = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.stopPropagation();
        this.setState({ selectDepartmentsDialogOpen: true });
    }

    private handleDepartmentsSelected = (selected: RoleInDepartment[]) => {
        const { role } = this.state;

        this.setState({
            selectDepartmentsDialogOpen: false,
            role: { ...role, roleDepartments: selected }
        });
    }

    render() {
        const { classes } = this.props;
        const {
            role,
            allDepartments,
            loading,
            formErrors,
            snackbarOpen,
            snackbarVariant,
            snackbarMessage,
            selectDepartmentsDialogOpen
        } = this.state;

        const faculties = role.roleDepartments.filter(o => o.departmentType === DepartmentType.Faculty);
        const trainingDepartments = role.roleDepartments.filter(o => o.departmentType === DepartmentType.TrainingDepartment);

        return (
            <div>
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
                                    title="Роль"
                                />
                                {loading && <LinearProgress variant="query" />}
                                <CardContent>
                                    <Grid container direction="column">
                                        <Grid container direction="row">
                                            <Grid item xs className={classes.margin1X}>
                                                <TextField
                                                    id="name"
                                                    name="name"
                                                    label="Наименование"
                                                    placeholder="Введите наименование роли"
                                                    margin="normal"
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    autoComplete="firstname"
                                                    disabled={loading}
                                                    value={role.name}
                                                    onChange={this.handleNameChange}
                                                    error={Boolean(formErrors.nameError)}
                                                    helperText={formErrors.nameError}
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
                                            <Typography className={classes.heading}>Подразделения и департаменты</Typography>
                                            <Grid item xs />
                                            <Tooltip title="Редактировать подразделения роли">
                                                <IconButton onClick={this.handleAddDepartment}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {role.roleDepartments.length ? (
                                            <List subheader={<li />}>
                                                {faculties.length ?
                                                    <div>
                                                        <ListSubheader>{"Факультеты и институты"}</ListSubheader>
                                                        {faculties.map(department =>
                                                            <ListItem>
                                                                <ListItemText key={department.id} primary={department.departmentName} />
                                                            </ListItem>
                                                        )}
                                                    </div>
                                                    : null
                                                }
                                                {trainingDepartments.length ?
                                                    <div>
                                                        <ListSubheader>{"Кафедры"}</ListSubheader>
                                                        {trainingDepartments.map(department =>
                                                            <ListItem>
                                                                <ListItemText key={department.id} primary={department.departmentName} />
                                                            </ListItem>
                                                        )}
                                                    </div>
                                                    : null
                                                }
                                            </List>
                                        ) : (
                                                <Grid container direction="row" justify="center">
                                                    <Typography color="textSecondary">Данная роль еще не используется подразделениями</Typography>
                                                </Grid>
                                            )}
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
                    </Grid>
                </form>
                <SelectDepartmentDialog
                    departments={allDepartments}
                    previousSelected={role.roleDepartments}
                    open={selectDepartmentsDialogOpen}
                    onClose={this.handleDepartmentsSelected}
                />
            </div>
        );
    }
}

export const RoleComponent = withStyles(styles)(withRouter(RoleBase));