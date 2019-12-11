import * as React from "react";
import { mergeStyles } from "../../utilities";
import { layoutStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Grid, Typography } from "@material-ui/core";

const styles = mergeStyles(layoutStyles);

export const IsUnderConstruction = withStyles(styles)(function (props: WithStyles<typeof styles>) {
    const { classes } = props;
    return (
        <Grid container direction="row" alignItems="center" justify="center" className={classes.root}>
            <Grid item xs />
            <Grid item>
                <Typography variant="h5" component="h5">Извините... Страница в разработке.</Typography>
            </Grid>
            <Grid item xs />
        </Grid>
    );
});