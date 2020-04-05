import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Tooltip, IconButton, Card, CardHeader, LinearProgress, CardContent, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import { ArrowBack, Close, Check, ExpandMore, Edit } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { Role, RoleValidation, Department, RoleInDepartment, AppState } from "../../models";
import { departmentService } from "../../services";

import { RoleDetails } from "./RoleDetails";
import { RoleDepartments, RoleDepartmentsDetails } from "./RoleDepartments";

import { roleActions } from "../../store/roleStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const RoleComponent = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { roleState } = Redux.useSelector((state: AppState) => ({
        roleState: state.roleState
    }));
    //#region Role state
    const [role, setRole] = React.useState<Role>(Role.initial);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target && event.target.value;

        setRole({ ...role, name });
    }
    //#endregion
    //#region Departments state
    const [allDepartments, setAllDepartments] = React.useState<Department[]>([]);
    const [roleDepartmentsDetailsOpen, setRoleDepartmentsDetailsOpen] = React.useState<boolean>(false);

    function handleAddDepartment(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setRoleDepartmentsDetailsOpen(true);
    }

    function handleDepartmentsSelected(selected: RoleInDepartment[]) {
        setRoleDepartmentsDetailsOpen(false);
        setRole({ ...role, roleDepartments: selected });
    }
    //#endregion
    const [formErrors, setFormErrors] = React.useState<RoleValidation>(RoleValidation.initial);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [] = React.useState<boolean>(true);

    React.useEffect(() => { initialize(); }, [props.match.params]);

    React.useEffect(() => {
        setLoading(roleState.roleLoading);
        if (roleState.roleLoading === false) {
            setRole(roleState.role);
        }
    }, [roleState.roleLoading]);
    React.useEffect(() => { dispatch(roleActions.validateRole(role)); }, [role])
    React.useEffect(() => { setFormErrors(roleState.formErrors) }, [roleState.formErrors]);

    async function loadAllDepartments() {
        setLoading(true);
        const allDepartments = await departmentService.getDepartments({});
        setAllDepartments(allDepartments);
        setLoading(false);
    }

    async function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(roleActions.getRole(id));

        await loadAllDepartments();
    }

    function handleBackClick() {
        const { history } = props;
        history.push(paths.rolesPath);
    }

    async function handleSaveClick() {
        dispatch(roleActions.saveRole(role));
    }

    async function handleCancelClick() {
        if (roleState.roleLoading === false) {
            setRole(roleState.role);
        }
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
                                    <RoleDepartments departments={role.roleDepartments} />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Card>
                    </Grid>
                    <Grid item xs={2} />
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