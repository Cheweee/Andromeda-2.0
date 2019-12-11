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
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ListSubheader
} from "@material-ui/core";
import { ArrowBack, Close, Check, ExpandMore, Edit } from "@material-ui/icons";
import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { useState, useEffect } from "react";
import { SnackbarVariant } from "../../models/commonModels";
import { RoleDetails } from "./RoleDetails";
import { RoleDepartments, RoleDepartmentsDetails } from "./RoleDepartments";
import { useSnackbarState } from "../../hooks";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

const initialRole: Role = {
    name: '',
    roleDepartments: []
};

const initialFormErrors: RoleValidation = { isValid: false };

export const RoleComponent = withStyles(styles)(withRouter(function (props: Props) {
    //#region Role state
    const [role, setRole] = useState<Role>(initialRole);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target && event.target.value;

        setRole({ ...role, name });
    }
    //#endregion
    //#region Departments state
    const [allDepartments, setAllDepartments] = useState<Department[]>([]);
    const [roleDepartmentsDetailsOpen, setRoleDepartmentsDetailsOpen] = useState<boolean>(false);

    function handleAddDepartment(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setRoleDepartmentsDetailsOpen(true);
    }

    function handleDepartmentsSelected(selected: RoleInDepartment[]) {
        setRoleDepartmentsDetailsOpen(false);
        setRole({ ...role, roleDepartments: selected });
    }
    //#endregion
    const [formErrors, setFormErrors] = useState<RoleValidation>(initialFormErrors);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useSnackbarState();

    useEffect(() => { initialize(); }, [props.match.params]);

    useEffect(() => {
        const formErrors = roleService.validateRole(role);
        setFormErrors(formErrors);
    }, [role]);

    async function loadRole() {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        let role: Role = initialRole;
        try {
            setLoading(true);
            const id = parseInt(tempId, 0);
            if (id) {
                const models = await roleService.getRoles({ id });
                role = models[0];
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
            setRole(role);
        }
    }

    async function loadAllDepartments() {
        setLoading(true);
        const allDepartments = await departmentService.getDepartments({});
        setAllDepartments(allDepartments);
        setLoading(false);
    }

    async function initialize() {
        await loadRole();
        await loadAllDepartments();
    }

    function handleBackClick() {
        const { history } = props;
        history.push(paths.rolesPath);
    }

    async function handleSaveClick() {
        try {
            setLoading(true);
            if (role.id)
                await roleService.update(role);
            else
                await roleService.create(role);
            setLoading(false);
            setSnackbar('Роль успешно сохранена', true, SnackbarVariant.success);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
    }

    async function handleCancelClick() {
        await loadRole();
    }

    const { classes } = props;

    return (
        <div>
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
                                title="Роль"
                            />
                            {loading && <LinearProgress variant="query" />}
                            <CardContent>
                                <RoleDetails
                                    disabled={loading}
                                    formErrors={formErrors}
                                    role={role}
                                    handleNameChange={handleNameChange}
                                />
                            </CardContent>
                        </Card>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                    <Grid container direction="row" alignItems="center">
                                        <Typography className={classes.heading}>Подразделения и департаменты</Typography>
                                        <Grid item xs />
                                        <Tooltip title="Редактировать подразделения роли">
                                            <IconButton onClick={handleAddDepartment}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <RoleDepartments departments={role.roleDepartments}/>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Card>
                    </Grid>
                    <Grid item xs={2} />
                    <MessageSnackbar
                        variant={snackbar.variant}
                        message={snackbar.message}
                        open={snackbar.open}
                        onClose={() => setSnackbar('', false, undefined)}
                    />
                </Grid>
            </form>
            <RoleDepartmentsDetails
                departments={allDepartments}
                previousSelected={role.roleDepartments}
                open={roleDepartmentsDetailsOpen}
                onClose={handleDepartmentsSelected}
            />
        </div >
    );
}));