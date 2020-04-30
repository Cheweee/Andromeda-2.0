import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Tooltip, IconButton, Card, LinearProgress, CardContent, Typography, Breadcrumbs, Link } from "@material-ui/core";
import { ArrowBack, Close, Check, Edit } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { Role, Department, RoleInDepartment, AppState } from "../../models";

import { RoleDetails } from "./RoleDetails";
import { RoleDepartments, RoleDepartmentsDetails } from "./RoleDepartments";

import { roleActions } from "../../store/roleStore";
import { departmentActions } from "../../store/departmentStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const RoleComponent = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const {
        roleState,
        departmentState
    } = Redux.useSelector((state: AppState) => ({
        roleState: state.roleState,
        departmentState: state.departmentState
    }));

    //#region Role state
    function handleRoleDetailsChange(model: Role) {
        dispatch(roleActions.updateRoleDetails(model));
    }
    //#endregion
    //#region Departments state
    const [roleDepartmentsDetailsOpen, setRoleDepartmentsDetailsOpen] = React.useState<boolean>(false);

    function handleEditRoleDepartments(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setRoleDepartmentsDetailsOpen(true);
    }

    function handleDepartmentsSelected(selected: RoleInDepartment[]) {
        setRoleDepartmentsDetailsOpen(false);
        dispatch(roleActions.updateRoleDepartments(selected));
    }
    //#endregion

    React.useEffect(() => { initialize(); }, [props.match.params]);

    async function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(roleActions.getRole(id));

        dispatch(departmentActions.getDepartments({}));
    }

    function handleBackClick() {
        const { history } = props;
        dispatch(roleActions.clearEditionState());
        history.push(paths.rolesPath);
    }

    async function handleSaveClick() {
        dispatch(roleActions.saveRole(role));
    }

    async function handleCancelClick() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(roleActions.getRole(id));
    }

    const { classes } = props;

    const disabled = roleState.roleLoading || departmentState.loading;

    let role: Role = null;
    if (roleState.roleLoading === false) {
        role = roleState.role;
    }
    let departments: Department[] = [];
    if (departmentState.loading === false) {
        departments = departmentState.departments;
    }

    return (
        <div>
            <form autoComplete="off" noValidate>
                <Grid container direction="row">
                    <Grid item xs={2} />
                    <Grid item xs container direction="column">
                        <Grid container direction="row" alignItems="center">
                            <Breadcrumbs>
                                <Link color="inherit" onClick={handleBackClick}>Роли и должности</Link>
                                <Typography color="textPrimary">{role && role.name || 'Новая роль'}</Typography>
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
                                    <IconButton color="primary" disabled={disabled || !roleState.formErrors.isValid} onClick={handleSaveClick}>
                                        <Check />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            {roleState.roleLoading && <LinearProgress variant="query" />}
                            <CardContent>
                                <RoleDetails
                                    disabled={disabled}
                                    formErrors={roleState.formErrors}
                                    role={role}
                                    onRoleDetailsChange={handleRoleDetailsChange}
                                />
                            </CardContent>
                        </Card>
                        <Grid container direction="row" alignItems="center">
                            <Typography>Подразделения и департаменты</Typography>
                            <Grid item xs />
                            <Tooltip title="Редактировать подразделения роли">
                                <span>
                                    <IconButton onClick={handleEditRoleDepartments}>
                                        <Edit />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            {departmentState.loading && <LinearProgress variant="query" />}
                            <CardContent>
                                <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                    <RoleDepartments departments={role && role.roleDepartments || []} />
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </form>
            <RoleDepartmentsDetails
                departments={departments}
                previousSelected={role && role.roleDepartments || []}
                open={roleDepartmentsDetailsOpen}
                onClose={handleDepartmentsSelected}
            />
        </div >
    );
}));