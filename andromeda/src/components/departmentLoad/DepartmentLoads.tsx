import * as React from "react";
import { useState } from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/styles";
import { DepartmentLoad, Filter } from "../../models";
import { Grid, Card, CardContent, Typography, IconButton } from "@material-ui/core";
import { DepartmentLoadDetails } from "./DepartmentLoadDetails";
import { BarChart, Search, Add } from "@material-ui/icons";
import { SearchInput } from "../common";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSnackbarState, useFilterState } from "../../hooks";
import { paths } from "../../sharedConstants";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
}

export const DepartmentLoads = withStyles(styles)(withRouter(function (props: Props) {
    //#region Department loads state
    const [departmentLoads, setDepartmentLoads] = useState<DepartmentLoad[]>([]);

    async function getDepartmentLoads() {

    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getDepartmentloadPath(props.match.params[paths.idParameterName], 'create'))
    }
    //#endregion

    const [filter, setFilter] = useFilterState(Filter.initialFilter);
    const [snackbar, setSnackbar] = useSnackbarState();

    function handleSearchChange(value: string) {
        setFilter(value);
    }

    const {
        classes
    } = props;
    return (
        <Grid container direction="column">
            <Grid container direction="row" alignItems="center">
                <BarChart color="primary" />
                <Typography>Нагрузка кафедры</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={handleSearchChange}
                    onSearch={getDepartmentLoads}
                />
                <IconButton onClick={handleAdd}>
                    <Add />
                </IconButton>
            </Grid>
            <Grid container direction="row">
                {departmentLoads.length ? departmentLoads.map(o => {
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>
                                <DepartmentLoadDetails
                                    departmentLoad={o}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                }) : (
                        <Grid container direction="row" justify="center">
                            <Typography color="textSecondary">Нагрузка на кафедру еще не была выделена.</Typography>
                        </Grid>
                    )}
            </Grid>
        </Grid>
    );
}));