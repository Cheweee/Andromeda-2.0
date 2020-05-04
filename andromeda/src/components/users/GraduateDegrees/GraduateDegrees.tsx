import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { UserGraduateDegree, ProjectType } from "../../../models";
import { ListItem, ListItemText, ListItemSecondaryAction, Grid, IconButton, List, Typography } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    graduateDegrees: UserGraduateDegree[];
    handleDelete: (branchOfScience: number) => void;
    handleEdit: (branchOfScience: number) => void;
}

export const GraduateDegrees = withStyles(styles)(function (props: Props) {
    const {
        disabled,
        graduateDegrees,
        handleDelete,
        handleEdit
    } = props;

    const listItems = graduateDegrees.map((graduateDegree, index) => (
        <ListItem key={index}>
            <ListItemText
                primary={UserGraduateDegree.getUserGraduateDegreeDescription(graduateDegree)}
                secondary={UserGraduateDegree.getUserGraduateDegreeShortening(graduateDegree)}
            />
            <ListItemSecondaryAction>
                <Grid container direction="row">
                    <IconButton disabled={disabled} onClick={() => handleEdit(graduateDegree.branchOfScience)}>
                        <Edit />
                    </IconButton>
                    <IconButton disabled={disabled} onClick={() => handleDelete(graduateDegree.branchOfScience)}>
                        <Delete />
                    </IconButton>
                </Grid>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <Grid container direction="column">
            {graduateDegrees.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{'У данного пользователя еще нет прикрепленных дисциплин.'}</Typography>
                    </Grid>
                )}
        </Grid>
    );
});