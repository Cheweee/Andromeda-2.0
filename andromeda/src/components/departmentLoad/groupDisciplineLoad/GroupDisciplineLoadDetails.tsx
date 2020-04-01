import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, ListItem, List, IconButton, Button, DialogActions } from "@material-ui/core";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import {
    StudentGroup,
    DisciplineTitle,
    StudyLoad,
    GroupDisciplineLoad,
    GroupDisciplineLoadValidation,
    ProjectType,
    ProjectTypes
} from "../../../models";
import { Autocomplete } from "@material-ui/lab";
import { Delete, Add } from "@material-ui/icons";
import { departmentLoadService } from "../../../services/departmentLoadService";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    groupDisciplineLoad: GroupDisciplineLoad;

    disciplinesTitles: DisciplineTitle[];
    groups: StudentGroup[];

    onAccept: (value: GroupDisciplineLoad) => void;
    onCancel: () => void;
}

export const GroupDisciplineLoadDetails = withStyles(styles)(function (props: Props) {
    const [disciplineTitle, setDisciplineTitle] = React.useState<DisciplineTitle>(DisciplineTitle.initial);
    const [group, setGroup] = React.useState<StudentGroup>(StudentGroup.initial);
    const [semesterNumber, setSemesterNumber] = React.useState<number>(1);
    const [studyLoads, setStudyLoads] = React.useState<StudyLoad[]>([]);
    const [formErrors, setFormErrors] = React.useState<GroupDisciplineLoadValidation>(GroupDisciplineLoadValidation.initial);

    React.useEffect(() => {
        const groupDisciplineLoad = props.groupDisciplineLoad || GroupDisciplineLoad.initial
        const disciplineTitle = groupDisciplineLoad.disciplineTitle || DisciplineTitle.initial;
        const group = groupDisciplineLoad.studentGroup || StudentGroup.initial;
        const studyLoad = groupDisciplineLoad.studyLoad || [];
        const semesterNumber = groupDisciplineLoad.semesterNumber || 1;

        setDisciplineTitle(disciplineTitle);
        setGroup(group);
        setStudyLoads(studyLoad);
        setSemesterNumber(semesterNumber);
    }, [props.groupDisciplineLoad]);

    React.useEffect(() => {
        const amount = studyLoads.map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const formErrors = departmentLoadService.validateGroupDisciplineLoad({
            amount: amount,
            disciplineTitle: disciplineTitle,
            disciplineTitleId: disciplineTitle.id,
            semesterNumber: semesterNumber,
            studentGroup: group,
            studentGroupId: group.id,
            studyLoad: studyLoads
        });
        setFormErrors(formErrors);
    }, [disciplineTitle, group, semesterNumber, studyLoads]);

    const {
        classes,
        open,

        disciplinesTitles,
        groups,

        onCancel
    } = props;

    function handleDisciplineTitleChange(event: React.ChangeEvent, value: DisciplineTitle) {
        setDisciplineTitle(value);
    }

    function handleStudentGroupChange(event: React.ChangeEvent, value: StudentGroup) {
        setGroup(value);
    }

    function handleSemesterNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
        let value = event && event.target.value;
        let semesterNumber = parseInt(value);

        setSemesterNumber(semesterNumber);
    }

    function handleProjectTypeChange(index, value: ProjectType) {
        const studyLoad = studyLoads[index];

        studyLoad.projectType = value;

        setStudyLoads([...studyLoads]);
    }

    function handleCreateStudyLoad() {
        const studyLoad: StudyLoad = { ...StudyLoad.initial };

        studyLoads.push(studyLoad);
        setStudyLoads([...studyLoads]);
    }

    function handleDeleteStudyLoad(index: number) {
        studyLoads.splice(index, 1);
        setStudyLoads([...studyLoads]);
    }

    function handleGroupsInStreamChange(index: number, value: string) {
        const studyLoad = studyLoads[index];

        studyLoad.shownValue = StudyLoad.updateGroupsInStream(studyLoad.shownValue, parseInt(value));
        studyLoad.value = StudyLoad.computeValue(studyLoad.shownValue);

        setStudyLoads([...studyLoads]);
    }

    function handleStudyLoadValueChange(index: number, value: string) {
        const studyLoad = studyLoads[index];

        if (studyLoad.projectType === ProjectType.lection) {
            studyLoad.shownValue = StudyLoad.updateComputedValue(studyLoad.shownValue, parseFloat(value));
            studyLoad.value = StudyLoad.computeValue(studyLoad.shownValue);
        }
        else {
            studyLoad.shownValue = value;
            studyLoad.value = parseFloat(value);
        }

        setStudyLoads([...studyLoads]);
    }

    function handleAccept() {
        const { onAccept } = props;

        const amount = studyLoads.map(o => o.value).reduce((prev, curr) => prev + curr, 0);

        let value: GroupDisciplineLoad = {
            amount: amount,
            disciplineTitle: disciplineTitle,
            disciplineTitleId: disciplineTitle.id,
            semesterNumber: semesterNumber,
            studentGroup: group,
            studentGroupId: group.id,
            studyLoad: studyLoads
        }

        onAccept(value);
    }

    const studyLoadsControls = studyLoads.map((o, index) => (
        <Grid key={index} container direction="row" alignItems="center">
            <Grid item xs>
                <Autocomplete
                    className={classes.w100}
                    noOptionsText={"Тип работ не найден"}
                    getOptionLabel={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
                    options={ProjectTypes}
                    value={o.projectType}
                    onChange={(event: React.ChangeEvent, value: ProjectType) => { handleProjectTypeChange(index, value); }}
                    renderOption={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
                    renderInput={params => (
                        <TextField
                            {...params}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Тип работ"
                            placeholder="Выберите тип работ"
                        // error={Boolean(formErrors.projectsTypesError)}
                        // helperText={formErrors.projectsTypesError}
                        />
                    )}
                />
            </Grid>
            {o.projectType === ProjectType.lection && (
                <Grid item xs="auto" className={classes.margin1Left}>
                    <TextField
                        label="Групп в потоке"
                        placeholder="Введите количество групп в потоке"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        inputProps={{
                            type: "number"
                        }}
                        value={StudyLoad.getGroupsInStream(o.shownValue)}
                        //disabled={disabled}
                        // error={Boolean(formErrors.semesterNumberError)}
                        // helperText={formErrors.semesterNumberError}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleGroupsInStreamChange(index, event && event.target.value)}
                    />
                </Grid>
            )}
            <Grid item xs="auto" className={classes.margin1Left}>
                <TextField
                    label="Количество часов"
                    placeholder="Введите количество часов"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{
                        step: "0.1",
                        type: "number"
                    }}
                    value={o.projectType === ProjectType.lection ? StudyLoad.getComputedValue(o.shownValue) : o.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleStudyLoadValueChange(index, event && event.target.value)}
                //disabled={disabled}
                // error={Boolean(formErrors.semesterNumberError)}
                // helperText={formErrors.semesterNumberError}
                //value={o.}
                />
            </Grid>
            <Grid item xs="auto" className={classes.margin1Left}>
                <IconButton onClick={() => handleDeleteStudyLoad(index)}>
                    <Delete />
                </IconButton>
            </Grid>
        </Grid>
    ));

    return (
        <Dialog fullWidth maxWidth="md" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Нагрузка дисциплины на группу</DialogTitle>
            <DialogContent>
                <Grid container direction="row">
                    <Grid item xs>
                        <Autocomplete
                            className={classes.w100}
                            noOptionsText={"Дисциплина не найдена"}
                            getOptionLabel={(option: DisciplineTitle) => `${option.name}`}
                            options={disciplinesTitles}
                            defaultValue={disciplinesTitles[0]}
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
                    </Grid>
                    <Grid item xs className={classes.margin1Left}>
                        <Autocomplete
                            className={classes.w100}
                            noOptionsText={"Группа не найдена"}
                            getOptionLabel={(option: StudentGroup) => `${option.name}`}
                            options={groups}
                            defaultValue={groups[0]}
                            value={group}
                            onChange={handleStudentGroupChange}
                            renderOption={(option: StudentGroup) => `${option.name}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    label="Учебная группа"
                                    placeholder="Выберите учебную группу"
                                    value={group ? group.name : ''}
                                    error={Boolean(formErrors.studentGroupError)}
                                    helperText={formErrors.studentGroupError}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs className={classes.margin1Left}>
                        <TextField
                            id="semesterNumber"
                            label="Номер семестра"
                            placeholder="Введите номер семестра"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            inputProps={{
                                type: "number"
                            }}
                            //disabled={disabled}
                            error={Boolean(formErrors.semesterNumberError)}
                            helperText={formErrors.semesterNumberError}
                            value={semesterNumber}
                            onChange={handleSemesterNumberChange}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="column">
                    {studyLoadsControls}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container direction="row">
                    <Grid item>
                        <Button onClick={handleCreateStudyLoad}>Добавить учебную нагрузку</Button>
                    </Grid>
                    <Grid item xs />
                    <Button onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button onClick={handleAccept} color="primary" autoFocus disabled={!formErrors.isValid}>
                        Сохранить
                </Button>
                </Grid>
            </DialogActions>
        </Dialog>
    );
});