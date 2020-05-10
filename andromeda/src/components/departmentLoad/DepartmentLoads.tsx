import * as React from "react";

import * as Redux from 'react-redux';
import { RouteComponentProps, withRouter } from "react-router";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { ArrowBack, Search, Add, InsertDriveFile, Edit, Delete } from "@material-ui/icons";
import { Grid, Card, CardContent, Typography, IconButton, Tooltip, CircularProgress, CardActions, Breadcrumbs, Link } from "@material-ui/core";

import { Input, ConfirmationDialog } from "../common";

import { commonStyles } from "../../muiTheme";
import { DepartmentLoad, DepartmentLoadImportOptions, AppState, TrainingDepartment } from "../../models";

import { departmentLoadActions } from "../../store/departmentLoadStore";

import { DepartmentLoadDetails } from "./DepartmentLoadDetails";
import { ImportLoadDetails } from "./ImportLoadDetails";

import { useDebounce } from '../../hooks';
import { paths } from "../../sharedConstants";
import { mergeStyles } from "../../utilities";
import { trainingDepartmentActions } from "../../store/trainingDepartmentStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
}

export const DepartmentLoads = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { departmentState, departmentLoadState } = Redux.useSelector((state: AppState) => ({
        departmentState: state.trainingDepartmentState,
        departmentLoadState: state.departmentLoadState
    }));

    const [search, setSearch] = React.useState<string>();
    const [id, setId] = React.useState<number>(null);
    const [open, setOpen] = React.useState<boolean>(false);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { initialize(); }, []);
    React.useEffect(() => { getDepartmentLoads(debouncedSearch); }, [debouncedSearch]);

    //#region Department loads state

    function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const departmentId = parseInt(tempId, null);
        dispatch(trainingDepartmentActions.getTrainingDepartment(departmentId));

        getDepartmentLoads();
    }

    function getDepartmentLoads(search?: string) {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const departmentId = parseInt(tempId, null);
        dispatch(departmentLoadActions.getModels({ departmentId: departmentId, search: search }));
    }

    function handleAdd() {
        const { history } = props;
        dispatch(departmentLoadActions.clearEditionState());
        history.push(paths.getDepartmentloadPath(props.match.params[paths.idParameterName], 'create'))
    }

    function handleEdit(data: DepartmentLoad) {
        const { history } = props;
        dispatch(departmentLoadActions.clearEditionState());
        history.push(paths.getDepartmentloadPath(props.match.params[paths.idParameterName], `${data.id}`));
    }

    function handleDelete(id: number) {
        setId(id);
        setOpen(true);
    }

    function handleConfirmationClose(result: boolean) {
        setOpen(false);
        setId(null);
        if (result) {
            const ids = [id];
            dispatch(departmentLoadActions.deleteModels(ids));
        }
    }

    function handleSearchChange(value: string) {
        setSearch(value);
    }
    //#endregion

    //#region Import load state
    const [importDetailsOpen, setImportDetailsOpen] = React.useState<boolean>(false);

    function handleImportDetailsAccept(options: DepartmentLoadImportOptions) {
        setImportDetailsOpen(false);

        const departmentId: number = props.match.params[paths.idParameterName];
        options.departmentId = departmentId;

        dispatch(departmentLoadActions.importDepartmentLoad(options));
    }
    //#endregion


    function handleToDepartmentsClick() {
        const { history } = props;
        history.push(paths.trainingDepartmentsPath);
    }

    function handleToDepartmentClick() {
        const { history } = props;
        history.push(paths.getTrainingDepartmentPath(props.match.params[paths.idParameterName]))
    }

    const { classes } = props;

    let departmentLoads: DepartmentLoad[] = [];
    if (departmentLoadState.modelsLoading === false) {
        departmentLoads = departmentLoadState.models;
    }

    let department: TrainingDepartment = null;
    if (departmentState.trainingDepartmentLoading === false) {
        department = departmentState.trainingDepartment;
    }

    return (
        <Grid container direction="column">
            <Grid container direction="row" alignItems="center">
                <Breadcrumbs>
                    <Link color="inherit" onClick={handleToDepartmentsClick}>Кафедры</Link>
                    <Link color="inherit" onClick={handleToDepartmentClick}>{department && department.name || ''}</Link>
                    <Typography color="textPrimary">Нагрузка кафедры</Typography>
                </Breadcrumbs>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <Input
                    value={search}
                    onValueChange={handleSearchChange}
                />
                <Tooltip title={"Создать учебную нагрузку"}>
                    <span>
                        <IconButton disabled={departmentLoadState.modelsLoading} onClick={handleAdd}>
                            <Add />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={"Экспортировать из Excel"}>
                    <span>
                        <IconButton disabled={departmentLoadState.modelsLoading} onClick={() => setImportDetailsOpen(true)}>
                            <InsertDriveFile />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
            {departmentLoadState.modelsLoading && (
                <Grid container direction="row" justify="center">
                    <CircularProgress />
                </Grid>
            )}
            {!departmentLoadState.modelsLoading && (
                <Grid container direction="row" wrap="wrap">
                    {Boolean(departmentLoads.length) ? departmentLoads.map((o, index) =>
                        <Grid key={index} item xs={3} className={classes.margin1}>
                            <Card>
                                <CardContent>
                                    <DepartmentLoadDetails
                                        studyYear={o.studyYear}
                                        totalLoad={o.total}
                                    />
                                </CardContent>
                                <CardActions>
                                    <IconButton onClick={() => handleEdit(o)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(o.id)}>
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ) : (
                            <Grid container direction="row" justify="center">
                                <Typography color="textSecondary">Нагрузка на кафедру еще не была выделена.</Typography>
                            </Grid>
                        )}
                </Grid>
            )}
            <ImportLoadDetails
                onAccept={handleImportDetailsAccept}
                onCancel={() => setImportDetailsOpen(false)}
                open={importDetailsOpen}
            />
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить нагрузку?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));