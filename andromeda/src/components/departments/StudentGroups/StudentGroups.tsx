import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Grid, List, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { StudentGroup } from "../../../models/studentGroupModels";
import { Edit, Delete } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    studentGroups: StudentGroup[];
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

export const StudentGroups = withStyles(styles)(function (props: Props) {
    const {
        classes,
        studentGroups,
        handleDelete,
        handleEdit
    } = props;

    const listItems = studentGroups.map((group, index) => (
        <ListItem key={index}>
            <ListItemText primary={`${group.name} (${group.studyDirection.shortName}) Курс: ${group.currentCourse} Студентов: ${group.studentsCount}`}
            secondary={`Год начала обучения: ${group.startYear}`} />
            <ListItemSecondaryAction>
                <Grid container direction="row">
                    <IconButton onClick={() => handleEdit(group.id)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(group.id)}>
                        <Delete />
                    </IconButton>
                </Grid>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <Grid container direction="column">
            {studentGroups.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{'У данной кафедры еще нет учебных групп.'}</Typography>
                    </Grid>
                )}
        </Grid>
    );
});