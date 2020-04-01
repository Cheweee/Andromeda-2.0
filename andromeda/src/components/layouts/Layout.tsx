import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Container, Grid } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import { routes } from "../../sharedConstants";
import { mergeStyles } from "../../utilities";
import { layoutStyles } from "../../muiTheme";
import { sessionService } from "../../services";
import { Menu } from "../common/Menu";

import clsx from "clsx";

const styles = mergeStyles(layoutStyles);

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    window?: () => Window;
    children: React.ReactElement;
}

export const Layout = withStyles(styles)(withRouter(function (props: Props) {
    function handleSignoutClick() {
        const { history } = props;
        sessionService.signOut();
        history.push('/sign-in');
    }

    const { classes, children, history } = props;

    const currentPath = history.location && history.location.pathname;

    return (
        <Grid container direction="row">
            <Grid item>
                <Menu
                    currentPath={currentPath}
                    routes={routes}
                    onSignoutClick={handleSignoutClick}
                />
            </Grid>
            <Grid item xs className={clsx(classes.content, classes.contentBackground)}>
                <Container className={classes.container}>
                    {children}
                </Container>
            </Grid>
        </Grid>
    );
}));