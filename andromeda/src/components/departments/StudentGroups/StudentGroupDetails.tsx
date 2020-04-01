import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, InputAdornment, DialogActions, Button, FormControl, FormHelperText } from "@material-ui/core";
import { StudentGroup, StudyDirection, StudentGroupValidation } from "../../../models";
import { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

const now = new Date();
const minYear = now.getFullYear() - 5;

interface Props extends WithStyles<typeof styles> {
    studyDirections: StudyDirection[];
    selectedGroup: StudentGroup;
    open: boolean;
    onCancel: () => void;
    onAccept: (group: StudentGroup) => void;
}

const initialGroup: StudentGroup = {
    currentCourse: 1,
    departmentId: 0,
    name: '',
    startYear: minYear,
    studentsCount: 0,
    studyDirectionId: 0,

    studyDirection: null
};

const initialValidation: StudentGroupValidation = {
    isValid: false,
};

export const StudentGroupDetails = withStyles(styles)(function (props: Props) {
    const [group, setGroup] = useState(initialGroup);
    const [formErrors, setFormErrors] = useState(initialValidation);

    useEffect(() => {
        if (props.selectedGroup)
            setGroup(props.selectedGroup);
    }, [props.selectedGroup]);

    useEffect(() => {
        const nameError = group.name ? '' : 'Наименование группы обязательно.';
        const startYearError = group.startYear > minYear ? '' : 'Введен некорректный год начала обучения.';
        const studentsCountError = group.studentsCount > 0 ? '' : 'Количество стундентов должно быть больше 0.';
        const studyDirectionError = group.studyDirection ? '' : 'Направление подготовки обязательно';
        const isValid = !nameError && !startYearError && !studentsCountError && !studyDirectionError;

        setFormErrors({
            nameError,
            startYearError,
            studentsCountError,
            studyDirectionError,
            isValid
        });
    }, [group]);

    const {
        classes,
        studyDirections,
        open,
        onCancel,
        onAccept
    } = props;

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({ ...group, name: event.target && event.target.value });
    }

    const handleStudyDirectionChange = (event: React.ChangeEvent, value: StudyDirection) => {
        setGroup({ ...group, studyDirectionId: value && value.id, studyDirection: value });
    }

    const handleStartYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const startYear = parseInt(event.target && event.target.value);
        setGroup({ ...group, startYear });
    }

    const handleStudentsCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const studentsCount = parseInt(event.target && event.target.value);
        setGroup({ ...group, studentsCount });
    }

    const handleAccept = () => {
        onAccept(group);
        setGroup(initialGroup);
    }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Учебная группа</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Autocomplete
                        className={classes.w100}
                        noOptionsText={"Направление подготовки не найдено"}
                        getOptionLabel={(option: StudyDirection) => `${option.code} ${option.shortName}`}
                        options={studyDirections}
                        value={group.studyDirection}
                        onChange={handleStudyDirectionChange}
                        renderOption={(option: StudyDirection) => `${option.code} ${option.shortName}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Направление подготовки"
                                placeholder="Выберите направление подготовки"
                                value={group.studyDirection ? `${group.studyDirection.code} ${group.studyDirection.shortName}` : ''}
                                error={Boolean(formErrors.studyDirectionError)}
                                helperText={formErrors.studyDirectionError}
                            />
                        )}
                    />
                    <Grid container direction="row">
                        <Grid item xs className={classes.margin1Right}>
                            <TextField
                                id="startyear"
                                type="number"
                                name="startyear"
                                label="Год начала обучения"
                                placeholder='Введите год начала обучения'
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                required
                                inputProps={{ min: minYear }}
                                InputProps={{ endAdornment: <InputAdornment position="end">г.</InputAdornment> }}
                                value={group.startYear}
                                onChange={handleStartYearChange}
                                error={Boolean(formErrors.startYearError)}
                                helperText={formErrors.startYearError}
                            />
                        </Grid>
                        <Grid item xs className={classes.margin1Left}>
                            <TextField
                                id="name"
                                name="name"
                                margin="normal"
                                type="number"
                                variant="outlined"
                                label="Количество студентов"
                                placeholder='Введите количество студентов'
                                fullWidth
                                required
                                inputProps={{ min: 0 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">чел.</InputAdornment> }}
                                value={group.studentsCount}
                                onChange={handleStudentsCountChange}
                                error={Boolean(formErrors.studentsCountError)}
                                helperText={formErrors.studentsCountError}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        id="name"
                        name="name"
                        label="Наименование"
                        placeholder={`Введите наименование группы`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        value={group.name}
                        onChange={handleNameChange}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
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