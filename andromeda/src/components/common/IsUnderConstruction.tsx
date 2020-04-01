import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Receipt } from "@material-ui/icons";

export const IsUnderConstruction = function () {
    return (
        <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs />
            <Grid container direction="column" item alignItems="center" justify="center">
                <Receipt style={{ fontSize: '200px' }} />
                <Typography variant="h5" component="h5">Извините... Страница в разработке.</Typography>
            </Grid>
            <Grid item xs />
        </Grid>
    );
};