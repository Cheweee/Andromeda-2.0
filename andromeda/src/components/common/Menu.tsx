import * as React from "react";

import { ExitToApp } from "@material-ui/icons";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import { mergeStyles } from "../../utilities";
import { layoutStyles, commonStyles } from "../../muiTheme";
import { Route } from "../../models";
import { isMenuItemSelected } from "../../sharedConstants";
import { Link } from "react-router-dom";

const styles = mergeStyles(layoutStyles, commonStyles);

interface Props extends WithStyles<typeof styles> {
    routes: Route[];
    currentPath: string;

    onSignoutClick: () => void;
}

export const Menu = withStyles(styles)(function (props: Props) {
    const {
        classes,
        routes,
        currentPath,
        onSignoutClick
    } = props;

    const menuItems = routes.filter(o => o.icon).map(route => {
        const Icon = route.icon;
        return (
            <ListItem className={isMenuItemSelected(route.path, currentPath) ? classes.contentBackground : ''} key={route.name} button component={Link} to={route.path}>
                <ListItemIcon>
                    <Icon color="primary" />
                </ListItemIcon>
                <ListItemText>{route.text}</ListItemText>
            </ListItem>
        );
    });

    return (
        <Grid className={classes.h100} container direction="column">
            <Grid item>
                <List>
                    {menuItems}
                </List>
            </Grid>
            <Grid item xs />
            <Grid item>
                <List>
                    <ListItem key="signOut" button onClick={onSignoutClick}>
                        <ListItemIcon>
                                <ExitToApp />
                        </ListItemIcon>
                        <ListItemText>{"Выйти из аккаунта"}</ListItemText>
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    )
});