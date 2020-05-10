import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import {
    StudentGroup,
    DisciplineTitle,
    GroupDisciplineLoad,
    GroupDisciplineLoadValidation
} from "../../../models";
import { Autocomplete } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly disciplinesTitles: DisciplineTitle[];
    readonly studentGroups: StudentGroup[];

    groupDisciplineLoad: GroupDisciplineLoad;
    formErrors: GroupDisciplineLoadValidation;

    onDetailsChange: (load: GroupDisciplineLoad) => void;
}

export const GroupDisciplineLoadDetails = withStyles(styles)(function (props: Props) {
    const [disciplineTitle, setDisciplineTitle] = React.useState<DisciplineTitle>(null);
    const [studentGroup, setStudentGroup] = React.useState<StudentGroup>(null);
    const [semesterNumber, setSemesterNumber] = React.useState<number>(0);

    React.useEffect(() => {
        setDisciplineTitle(groupDisciplineLoad ? groupDisciplineLoad.disciplineTitle : null);
        setStudentGroup(groupDisciplineLoad ? groupDisciplineLoad.studentGroup : null);
        setSemesterNumber(groupDisciplineLoad ? groupDisciplineLoad.semesterNumber : 0);
    }, [props.groupDisciplineLoad]);

    function handleDisciplineTitleChange(event: React.ChangeEvent<HTMLSelectElement>, value: DisciplineTitle) {
        const { onDetailsChange } = props;

        const load: GroupDisciplineLoad = { ...groupDisciplineLoad, disciplineTitle: value, disciplineTitleId: value && value.id };
        onDetailsChange(load);
    }

    function handleStudentGroupChange(event: React.ChangeEvent<HTMLSelectElement>, value: StudentGroup) {
        const { onDetailsChange } = props;

        const load: GroupDisciplineLoad = { ...groupDisciplineLoad, studentGroup: value, studentGroupId: value && value.id };
        onDetailsChange(load);
    }

    function handleSemesterNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onDetailsChange } = props;

        const semester = event && event.target.value || 0;

        const load: GroupDisciplineLoad = { ...groupDisciplineLoad, semesterNumber: semester ? parseInt(semester) : null };
        onDetailsChange(load);
    }

    const {
        disciplinesTitles,
        studentGroups,

        groupDisciplineLoad,
        formErrors,

        classes
    } = props;

    return (
        <Grid>
            <Grid container direction="column">
                <Grid item>
                    <Autocomplete
                        noOptionsText={"Дисциплина не найдена"}
                        getOptionLabel={(option: DisciplineTitle) => `${option.name}`}
                        getOptionSelected={(option: DisciplineTitle, value: DisciplineTitle) => value && option.id === value.id}
                        options={disciplinesTitles}
                        value={disciplineTitle}
                        onChange={handleDisciplineTitleChange}
                        renderOption={(option: DisciplineTitle) => `${option.name}`}
                        renderInput={params => (
                            <TextField
                                {...params}
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
                </Grid>
                <Grid item container direction="row">
                    <Grid item xs>
                        <Autocomplete
                            noOptionsText={"Группа не найдена"}
                            getOptionLabel={(option: StudentGroup) => `${option.name}`}
                            getOptionSelected={(option: StudentGroup, value: StudentGroup) => value && option.id === value.id}
                            options={studentGroups}
                            value={studentGroup}
                            onChange={handleStudentGroupChange}
                            renderOption={(option: StudentGroup) => `${option.name}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    margin="normal"
                                    variant="outlined"
                                    label="Учебная группа"
                                    placeholder="Выберите учебную группу"
                                    value={studentGroup ? studentGroup.name : ''}
                                    error={Boolean(formErrors.studentGroupError)}
                                    helperText={formErrors.studentGroupError}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.margin1Left}>
                        <TextField
                            id="semesterNumber"
                            label="Номер семестра"
                            placeholder="Введите номер семестра"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            inputProps={{ type: "number", min: 0, max: 10 }}
                            value={semesterNumber}
                            onChange={handleSemesterNumberChange}
                            error={Boolean(formErrors.semesterNumberError)}
                            helperText={formErrors.semesterNumberError}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});