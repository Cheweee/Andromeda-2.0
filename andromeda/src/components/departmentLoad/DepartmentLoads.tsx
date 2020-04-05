import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { DepartmentLoad, Filter, ApplicationError, SnackbarVariant, DepartmentLoadImportOptions } from "../../models";
import { Grid, Card, CardContent, Typography, IconButton, Tooltip, CircularProgress, CardActions } from "@material-ui/core";
import { DepartmentLoadDetails } from "./DepartmentLoadDetails";
import { SearchInput, MessageSnackbar } from "../common";
import { RouteComponentProps, withRouter } from "react-router-dom";
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
    const [deparmtnetId, setDepartmentId] = useState<number>(0);

    useEffect(() => { getDepartmentLoads(); }, [props.match.params]);

    async function getDepartmentLoads() {
        try {
            setLoading(true);
            const departmentId = props.match.params[paths.idParameterName];

            const loads = await departmentLoadService.getDepartmentLoads({
                departmentId: departmentId
            });

            setDepartmentId(departmentId);
            setDepartmentLoads(loads);
        }
        catch (error) {
            // if (error instanceof ApplicationError)
                // setSnackbar(error.message, true, SnackbarVariant.error);
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

    async function handleDelete(id: number) {
        await departmentLoadService.delete([id]);
        await getDepartmentLoads();
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
            // if (error instanceof ApplicationError)
            //     setSnackbar(error.message, true, SnackbarVariant.error);
        }
        finally {
            setLoading(false);
        }
    }
    //#endregion

    const [search, setSearch] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);

    function handleSearchChange(value: string) {
        setSearch(value);
    }

    function handleBackClick() {
        const { history } = props;
        history.push(paths.getTrainingDepartmentPath(departmentId));
    }

    const { classes } = props;
    const departmentId = props.match.params[paths.idParameterName];

    return (
        <Grid container direction="column">
            <Grid container direction="row" alignItems="center">
                <Tooltip title="Вернуться назад">
                    <span>
                        <IconButton disabled={loading} onClick={handleBackClick}>
                            <ArrowBack />
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography>Нагрузка кафедры</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    search={search}
                    onSearchChange={handleSearchChange}
                />
                <Tooltip title={"Создать учебную нагрузку"}>
                    <span>
                        <IconButton disabled={loading} onClick={handleAdd}>
                            <Add />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={"Экспортировать из Excel"}>
                    <span>
                        <IconButton disabled={loading} onClick={() => setImportDetailsOpen(true)}>
                            <InsertDriveFile />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid>
            {loading && (
                <Grid container direction="row" justify="center">
                    <CircularProgress />
                </Grid>
            )}
            {!loading && (
                <Grid container direction="row" wrap="wrap">
                    {departmentLoads.length ? departmentLoads.map(o =>
                        <Grid item xs={3} className={classes.margin1}>
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
                departmentId={departmentId}
                onAccept={handleImportDetailsAccept}
                onCancel={() => setImportDetailsOpen(false)}
                open={importDetailsOpen}
            />
        </Grid >
    );
}));