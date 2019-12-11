import * as React from "react";
import { RouteComponentProps } from "react-router";

import { Grid, Typography } from "@material-ui/core";

import { mergeStyles } from "../utilities";
import { useState, useEffect } from "react";

const styles = mergeStyles();

interface Props extends RouteComponentProps {
}

export const ErrorPage = function (props: Props) {
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        const { location: { state: locationState } } = props;

        setMessage(locationState && locationState.message);
    }, [props.location]);

    return (
        <Grid container direction="column" component="main" alignItems="center" justify="center">
            <Typography variant="h1" component="h1">Oh no... Something went wrong...</Typography>
            <Typography variant="h3" component="h3">{message}</Typography>
        </Grid>
    );
};