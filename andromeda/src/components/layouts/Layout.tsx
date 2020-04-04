import * as React from "react";
import * as Redux from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Container, Grid } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import { routes } from "../../sharedConstants";
import { mergeStyles } from "../../utilities";
import { layoutStyles } from "../../muiTheme";
import { sessionService } from "../../services";
import { Menu } from "../common/Menu";

import clsx from "clsx";
import { MessageSnackbar } from "../common";
import { AppState } from "../../models/reduxModels";
import { SnackbarVariant } from "../../models";
import { snackbarActions } from "../../store/snackbarStore";
import { userActions } from "../../store/userStore";

const styles = mergeStyles(layoutStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
    children: React.ReactElement;
}

export const Layout = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { snackbarState } = Redux.useSelector((state: AppState) => ({
        snackbarState: state.snackbarState
    }));

    const [variant, setVariant] = React.useState<SnackbarVariant>(SnackbarVariant.info);
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');

    React.useEffect(() => {
        if (snackbarState.show !== true) {
            setOpen(false);
            return;
        }

        setVariant(snackbarState.variant);
        setOpen(true);
        setMessage(snackbarState.message);
    }, [snackbarState]);

    function handleSignoutClick() {
        const { history } = props;
        dispatch(userActions.signout());
        history.push('/sign-in');
    }

    function handleSnackbarClose() { dispatch(snackbarActions.hideSnackbar()); }

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
            <MessageSnackbar
                variant={variant}
                open={open}
                message={message}
                onClose={handleSnackbarClose}
            />
        </Grid>
    );
}));