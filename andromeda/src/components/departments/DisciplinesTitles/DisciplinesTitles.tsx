import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Grid, List, Typography, ListItemText, ListItem, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { DisciplineTitle } from "../../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disciplinesTitles: DisciplineTitle[];
    handleDelete: (id: number) => void;
    handleEdit: (id: number) => void;
}

export const DisciplinesTitles = withStyles(styles)(function (props: Props) {
    const {
        disciplinesTitles,
        handleDelete,
        handleEdit
    } = props;

    const listItems = disciplinesTitles.map((title, index) => (
        <ListItem key={index}>
            <ListItemText
                primary={title.name}
                secondary={title.shortname}
            />
            <ListItemSecondaryAction>
                <Grid container direction="row">
                    <IconButton onClick={() => handleEdit(title.id)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(title.id)}>
                        <Delete />
                    </IconButton>
                </Grid>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <Grid container direction="column">
            {disciplinesTitles.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{'У данной кафедры еще нет дисциплин.'}</Typography>
                    </Grid>
                )}
        </Grid>
    );
})