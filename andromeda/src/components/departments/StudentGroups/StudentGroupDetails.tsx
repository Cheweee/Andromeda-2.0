import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, InputAdornment, DialogActions, Button, FormControl, FormHelperText } from "@material-ui/core";
import { StudentGroup, StudyDirection, StudentGroupValidation } from "../../../models";
import { Autocomplete } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const minYear = now.getFullYear() - 5;

interface Props extends WithStyles<typeof styles> {
    studyDirections: StudyDirection[];
    group: StudentGroup;
    open: boolean;
    onCancel: () => void;
    onAccept: (group: StudentGroup) => void;
}

export const StudentGroupDetails = withStyles(styles)(function (props: Props) {
    const [name, setName] = React.useState<string>('');
    const [startYear, setStartYear] = React.useState<number>(minYear);
    const [studentsCount, setStudentsCount] = React.useState<number>(0);
    const [studyDirection, setStudyDirection] = React.useState<StudyDirection>(null);
    const [formErrors, setFormErrors] = React.useState<StudentGroupValidation>(StudentGroupValidation.initial);

    React.useEffect(() => {
        setName(props.group ? props.group.name : '');
        setStudyDirection(props.group ? props.group.studyDirection : null);
        setStartYear(props.group ? props.group.startYear : minYear);
        setStudentsCount(props.group ? props.group.studentsCount : 0);
    }, [props.group]);

    React.useEffect(() => {
        const nameError = name ? '' : 'Наименование группы обязательно.';
        const startYearError = startYear >= minYear ? '' : 'Введен некорректный год начала обучения.';
        const studentsCountError = studentsCount > 0 ? '' : 'Количество стундентов должно быть больше 0.';
        const studyDirectionError = studyDirection ? '' : 'Направление подготовки обязательно';
        const isValid = !nameError && !startYearError && !studentsCountError && !studyDirectionError;

        setFormErrors({
            nameError,
            startYearError,
            studentsCountError,
            studyDirectionError,
            isValid
        });
    }, [name, startYear, studentsCount, studyDirection]);

    const {
        classes,
        studyDirections,
        open,
        onCancel,
        onAccept
    } = props;

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target && event.target.value);
    }

    function handleStudyDirectionChange(event: React.ChangeEvent, value: StudyDirection) {
        setStudyDirection(value);
    }

    function handleStartYearChange(event: React.ChangeEvent<HTMLInputElement>) {
        const startYear = parseInt(event.target && event.target.value);
        setStartYear(startYear);
    }

    function handleStudentsCountChange(event: React.ChangeEvent<HTMLInputElement>) {
        const studentsCount = parseInt(event.target && event.target.value);
        setStudentsCount(studentsCount);
    }

    function handleAccept() {
        onAccept({
            currentCourse: currentMonth > 8 ? currentYear - startYear : currentYear - 1 - startYear,
            name: name,
            startYear: startYear,
            studentsCount: studentsCount,
            studyDirectionId: studyDirection.id,
            studyDirection: studyDirection
        });
        setName('');
        setStudyDirection(null);
        setStartYear(minYear);
        setStudentsCount(0);
    }

    function handleCancel() {
        onCancel();
        setName('');
        setStudyDirection(null);
        setStartYear(minYear);
        setStudentsCount(0);
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
                        value={studyDirection}
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
                                value={studyDirection ? `${studyDirection.code} ${studyDirection.shortName}` : ''}
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
                                value={startYear}
                                onChange={handleStartYearChange}
                                error={Boolean(formErrors.startYearError)}
                                helperText={formErrors.startYearError}
                            />
                        </Grid>
                        <Grid item xs className={classes.margin1Left}>
                            <TextField
                                id="studentsCount"
                                name="studentsCount"
                                margin="normal"
                                type="number"
                                variant="outlined"
                                label="Количество студентов"
                                placeholder='Введите количество студентов'
                                fullWidth
                                required
                                inputProps={{ min: 0 }}
                                InputProps={{ endAdornment: <InputAdornment position="end">чел.</InputAdornment> }}
                                value={studentsCount}
                                onChange={handleStudentsCountChange}
                                error={Boolean(formErrors.studentsCountError)}
                                helperText={formErrors.studentsCountError}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        id="studentGroupName"
                        name="name"
                        label="Наименование"
                        placeholder={`Введите наименование группы`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        value={name}
                        onChange={handleNameChange}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    Отмена
                    </Button>
                <Button disabled={!formErrors.isValid} onClick={handleAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});