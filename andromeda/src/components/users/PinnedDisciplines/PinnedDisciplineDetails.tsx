import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, InputAdornment, DialogActions, Button, FormControl, FormHelperText } from "@material-ui/core";
import { PinnedDisciplineValidation, DisciplineTitle } from "../../../models";
import { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { ProjectTypes, ProjectType, getProjectTypeDescription } from "../../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disciplinesTitles: DisciplineTitle[];
    projectTypes: ProjectType[];
    disciplineTitle: DisciplineTitle;
    open: boolean;
    onCancel: () => void;
    onAccept: (disciplinesTitle: DisciplineTitle, projectTypes: ProjectType[]) => void;
}

const initialPinnedDiscipline: DisciplineTitle = {
    name: '',
};

const initialValidation: PinnedDisciplineValidation = {
    isValid: false,
};

export const PinnedDisciplineDetails = withStyles(styles)(function (props: Props) {
    const [disciplineTitle, setDisciplineTitle] = useState<DisciplineTitle>(initialPinnedDiscipline);
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
    const [formErrors, setFormErrors] = useState(initialValidation);

    useEffect(() => {
        setDisciplineTitle(props.disciplineTitle);
    }, [props.disciplineTitle]);

    useEffect(() => { setProjectTypes(props.projectTypes); }, [props.projectTypes]);

    useEffect(() => {
        const disciplineTitleError = disciplineTitle && disciplineTitle.name ? '' : 'Выберите дисциплину.';
        const projectsTypesError = projectTypes && projectTypes.length ? '' : 'Выберите типы работ.';
        const isValid = !disciplineTitleError && !projectsTypesError;

        setFormErrors({
            disciplineTitleError,
            projectsTypesError,
            isValid
        });
    }, [disciplineTitle, projectTypes]);

    const {
        classes,
        disciplinesTitles,
        open,
        onCancel,
        onAccept
    } = props;

    const handleStudyDirectionChange = (event: React.ChangeEvent, value: DisciplineTitle) => {
        setDisciplineTitle(value);
    }

    const handleProjectTypeChange = (event: React.ChangeEvent, values: ProjectType[]) => {
        setProjectTypes(values);
    }

    const handleAccept = () => {
        onAccept(disciplineTitle, projectTypes);
        setDisciplineTitle(initialPinnedDiscipline);
        setProjectTypes([]);
    }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Прикрепленная дисциплина</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Autocomplete
                        className={classes.w100}
                        noOptionsText={"Дисциплина не найдена"}
                        getOptionLabel={(option: DisciplineTitle) => `${option.name}`}
                        options={disciplinesTitles}
                        value={disciplineTitle}
                        onChange={handleStudyDirectionChange}
                        renderOption={(option: DisciplineTitle) => `${option.name}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Учебная дисциплина"
                                placeholder="Выберите учебную дисциплину"
                                value={disciplineTitle ? disciplineTitle.name : ''}
                                error={Boolean(formErrors.disciplineTitleError)}
                                helperText={formErrors.disciplineTitleError}
                            />
                        )}
                    />
                    <Autocomplete
                        className={classes.w100}
                        multiple
                        noOptionsText={"Тип работ не найден"}
                        getOptionLabel={(option: ProjectType) => `${getProjectTypeDescription(option)}`}
                        options={ProjectTypes}
                        value={projectTypes}
                        onChange={handleProjectTypeChange}
                        renderOption={(option: ProjectType) => `${getProjectTypeDescription(option)}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Типы работ"
                                placeholder="Выберите типы работ"
                                error={Boolean(formErrors.projectsTypesError)}
                                helperText={formErrors.projectsTypesError}
                            />
                        )}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Отмена
                    </Button>
                <Button disabled={!formErrors.isValid} onClick={handleAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});