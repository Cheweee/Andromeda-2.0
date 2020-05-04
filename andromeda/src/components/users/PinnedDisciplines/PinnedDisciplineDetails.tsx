import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from "@material-ui/core";
import { PinnedDisciplineValidation, DisciplineTitle } from "../../../models";
import { Autocomplete } from "@material-ui/lab";
import { ProjectTypes, ProjectType } from "../../../models/commonModels";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disciplinesTitles: DisciplineTitle[];
    projectTypes: ProjectType[];
    disciplineTitle: DisciplineTitle;
    open: boolean;

    onAccept: (disciplinesTitle: DisciplineTitle, projectTypes: ProjectType[]) => void;
    onCancel: () => void;
}

export const PinnedDisciplineDetails = withStyles(styles)(function (props: Props) {
    const [disciplineTitle, setDisciplineTitle] = React.useState<DisciplineTitle>(DisciplineTitle.initial);
    const [projectTypes, setProjectTypes] = React.useState<ProjectType[]>([]);
    const [formErrors, setFormErrors] = React.useState<PinnedDisciplineValidation>(PinnedDisciplineValidation.initial);

    React.useEffect(() => {
        setDisciplineTitle(props.disciplineTitle);
    }, [props.disciplineTitle]);

    React.useEffect(() => { setProjectTypes(props.projectTypes); }, [props.projectTypes]);

    React.useEffect(() => {
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

    function handleDisciplineTitleChange (event: React.ChangeEvent, value: DisciplineTitle) {
        setDisciplineTitle(value);
    }

    function handleProjectTypeChange (event: React.ChangeEvent, values: ProjectType[]) {
        setProjectTypes(values);
    }

    function handleAccept() {
        onAccept(disciplineTitle, projectTypes);
        setDisciplineTitle(DisciplineTitle.initial);
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
                        onChange={handleDisciplineTitleChange}
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
                        getOptionLabel={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
                        options={ProjectTypes}
                        value={projectTypes}
                        onChange={handleProjectTypeChange}
                        renderOption={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
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