import * as React from "react";
import { withStyles, Grid, Card, CardContent, WithStyles, Typography, CardHeader, IconButton, Fab, Tooltip, TextField, Input, InputBase, CircularProgress } from "@material-ui/core";
import { mergeStyles } from "../utilities";
import { commonStyles, chartStyles } from "../muiTheme";
import { IsUnderConstruction } from "./common";

const styles = mergeStyles(chartStyles, commonStyles);

interface Props extends WithStyles<typeof styles> { }

export const Dashboard = withStyles(styles)(function (props: Props) {   
    return <IsUnderConstruction />
});