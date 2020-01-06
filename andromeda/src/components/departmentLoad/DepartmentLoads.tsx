import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/styles";
import { DepartmentLoad, Filter, ApplicationError, SnackbarVariant, DepartmentLoadImportOptions } from "../../models";
import { Grid, Card, CardContent, Typography, IconButton, Tooltip, CircularProgress, CardActions } from "@material-ui/core";
import { DepartmentLoadDetails } from "./DepartmentLoadDetails";
import { SearchInput, MessageSnackbar } from "../common";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSnackbarState, useFilterState } from "../../hooks";
import { paths } from "../../sharedConstants";
import { ArrowBack, Search, Add, InsertDriveFile, Edit, Delete } from "@material-ui/icons";
import { departmentLoadService } from "../../services/departmentLoadService";
import { ImportLoadDetails } from "./ImportLoadDetails";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
}

export const DepartmentLoads = withStyles(styles)(withRouter(function (props: Props) {
    //#region Department loads state
    const [departmentLoads, setDepartmentLoads] = useState<DepartmentLoad[]>([]);

    useEffect(() => { getDepartmentLoads(); }, [props.match.params]);

    async function getDepartmentLoads() {
        try {
            setLoading(true);
            const departmentId = props.match.params[paths.idParameterName];

            const loads = await departmentLoadService.getDepartmentLoads({
                departmentId: departmentId
            });

            setDepartmentLoads(loads);
        }
        catch (error) {
            if (error instanceof ApplicationError)
                setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getDepartmentloadPath(props.match.params[paths.idParameterName], 'create'))
    }

    function handleEdit(data: DepartmentLoad) {
        const { history } = props;
        history.push(paths.getDepartmentloadPath(props.match.params[paths.idParameterName], `${data.id}`));
    }

    function handleDelete(id: number) {
    }
    //#endregion

    //#region Import load state
    const [importDetailsOpen, setImportDetailsOpen] = useState<boolean>(false);

    async function handleImportDetailsAccept(options: DepartmentLoadImportOptions) {
        try {
            setLoading(true);
            setImportDetailsOpen(false);
            const departmentId: number = props.match.params[paths.idParameterName];

            options.departmentId = departmentId;
            const load = await departmentLoadService.import(options);
            const { history } = props;
            history.push(paths.getDepartmentloadPath(`${departmentId}`, `${load.id}`));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }
    //#endregion

    const [filter, setFilter] = useFilterState(Filter.initialFilter);
    const [snackbar, setSnackbar] = useSnackbarState();

    const [loading, setLoading] = useState<boolean>(false);

    function handleSearchChange(value: string) {
        setFilter(value);
    }

    function handleBackClick() {
        const { history } = props;
        history.push(paths.trainingDepartmentsPath);
    }

    const { classes } = props;
    const departmentId = props.match.params[paths.idParameterName];

    return (
        <Grid container direction="column">
            <Grid container direction="row" alignItems="center">
                <Tooltip title="Вернуться назад">
                    <IconButton disabled={loading} onClick={handleBackClick}>
                        <ArrowBack />
                    </IconButton>
                </Tooltip>
                <Typography>Нагрузка кафедры</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={handleSearchChange}
                    onSearch={getDepartmentLoads}
                />
                <IconButton disabled={loading} onClick={handleAdd}>
                    <Add />
                </IconButton>
                <Tooltip title={"Экспортировать из Excel"}>
                    <IconButton disabled={loading} onClick={() => setImportDetailsOpen(true)}>
                        <InsertDriveFile />
                    </IconButton>
                </Tooltip>
            </Grid>
            {loading && (
                <Grid container direction="row" justify="center">
                    <CircularProgress />
                </Grid>
            )
            }
            {!loading && (
                <Grid container direction="row" wrap="wrap">
                    {departmentLoads.length ? departmentLoads.map(o =>
                        <Grid item xs={3} className={classes.margin1}>
                            <Card>
                                <CardContent>
                                    <DepartmentLoadDetails
                                        departmentLoad={o}
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
            )
            }
            <MessageSnackbar
                variant={snackbar.variant}
                message={snackbar.message}
                open={snackbar.open}
                onClose={() => setSnackbar('', false, undefined)}
            />
            <ImportLoadDetails
                departmentId={departmentId}
                onAccept={handleImportDetailsAccept}
                onCancel={() => setImportDetailsOpen(false)}
                open={importDetailsOpen}
            />
        </Grid >
    );
}));