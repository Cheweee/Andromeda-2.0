import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Container,
    Tooltip,
    Grid,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";

import { routes } from "../../sharedConstants";
import { mergeStyles } from "../../utilities";
import { layoutStyles } from "../../muiTheme";
import { Dashboard, ExitToApp, SupervisorAccount } from "@material-ui/icons";
import { sessionService } from "../../services";

const styles = mergeStyles(layoutStyles);

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    window?: () => Window;
    children: React.ReactElement;
}

export const Layout = withStyles(styles)(withRouter(function (props: Props) {
    function signOut() {
        const { history } = props;
        sessionService.signOut();
        history.push('/sign-in');
    }

    const { classes, children, history } = props;

    const currentPath = history.location && history.location.pathname;

    const menuItems = routes.filter(o => o.icon).map(route => {
        const Icon = route.icon;
        return (
            <Tooltip title={route.text}>
                <ListItem key={route.name} button onClick={() => { history.push(route.path) }}>
                    <ListItemIcon>
                        <Icon color={currentPath === route.path ? "secondary" : "primary"} />
                    </ListItemIcon>
                </ListItem>
            </Tooltip>
        );
    });

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                classes={{ paper: `${classes.drawerPaper} ${classes.drawerPaperClose}` }}
            >
                <Grid container direction="column" className={classes.root}>
                    <Grid item>
                        <List>
                            {menuItems}
                        </List>
                    </Grid>
                    <Grid item xs />
                    <Grid item>
                        <List>
                            <ListItem key="signOut" button onClick={signOut}>
                                <ListItemIcon>{
                                    <Tooltip title={"Выйти из аккаунта"}>
                                        <ExitToApp />
                                    </Tooltip>
                                }
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Drawer>
            <div className={classes.content}>
                <Container className={classes.container}>
                    {children}
                </Container>
            </div>
        </div>
    );
}));