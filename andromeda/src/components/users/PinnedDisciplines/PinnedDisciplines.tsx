import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Grid, List, Typography, ListItemText, ListItem, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { PinnedDiscipline } from "../../../models";
import { ProjectType } from "../../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    pinnedDisciplines: PinnedDiscipline[];
    handleDelete: (disciplineTitleId: number) => void;
    handleEdit: (disciplineTitleId: number) => void;
}

export const PinnedDisciplines = withStyles(styles)(function (props: Props) {
    const {
        disabled,
        pinnedDisciplines,
        handleDelete,
        handleEdit
    } = props;

    const disciplinesDisctionary = [];

    for (const discipline of pinnedDisciplines) {
        if (disciplinesDisctionary.find(o => o.disciplineTitle === discipline.disciplineTitle))
            continue;

        const projectsTypes = pinnedDisciplines.filter(o => o.disciplineTitleId === discipline.disciplineTitleId).map(o => o.projectType);
        const projectsTypesDescription: string = projectsTypes.reduce((previous: string, current: ProjectType) => (previous ? (previous + '; ') : '') + ProjectType.getProjectTypeDescription(current), undefined);

        disciplinesDisctionary.push({
            disciplineTitle: discipline.disciplineTitle,
            disciplineTitleId: discipline.disciplineTitleId,
            id: discipline.id,
            projectsTypes: projectsTypes,
            projectsTypesDescription: projectsTypesDescription
        });
    }

    const listItems = disciplinesDisctionary.map((discipline, index) => (
        <ListItem key={index}>
            <ListItemText
                primary={discipline.disciplineTitle}
                secondary={discipline.projectsTypesDescription}
            />
            <ListItemSecondaryAction>
                <Grid container direction="row">
                    <IconButton disabled={disabled} onClick={() => handleEdit(discipline.disciplineTitleId)}>
                        <Edit />
                    </IconButton>
                    <IconButton disabled={disabled} onClick={() => handleDelete(discipline.disciplineTitleId)}>
                        <Delete />
                    </IconButton>
                </Grid>
            </ListItemSecondaryAction>
        </ListItem>
    ));

    return (
        <Grid container direction="column">
            {pinnedDisciplines.length ? (
                <List>{listItems}</List>
            ) : (
                    <Grid container direction="row" justify="center">
                        <Typography color="textSecondary">{'У данного пользователя еще нет прикрепленных дисциплин.'}</Typography>
                    </Grid>
                )}
        </Grid>
    );
})