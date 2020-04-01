import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { StudyDirection } from "../../../models/studyDirectionModels";
import { Grid, List, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    studyDirections: StudyDirection[];
    handleStudyDirectionEdit: (id: number) => void;
    handleStudyDirectionDelete: (id: number) => void;
}

export const StudyDirections = withStyles(styles)(function (props: Props) {
    const {
        classes,
        studyDirections,

        handleStudyDirectionDelete,
        handleStudyDirectionEdit
    } = props;

    const emptyDepartmentUsersMessage = 'У данной кафедры еще нет направлений подготовки';

    const listItems = studyDirections.map((direction, index) => {
        return (
            <ListItem key={index}>
                <ListItemText primary={`${direction.code} ${direction.shortName}`} secondary={direction.name} />
                <ListItemSecondaryAction>
                    <Grid container direction="row">
                        <IconButton onClick={() => handleStudyDirectionEdit(direction.id)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleStudyDirectionDelete(direction.id)}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
        )
    });

    return (
        <Grid container direction="column">
            {studyDirections.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{emptyDepartmentUsersMessage}</Typography>
                    </Grid>
                )
            }
        </Grid>
    );
});