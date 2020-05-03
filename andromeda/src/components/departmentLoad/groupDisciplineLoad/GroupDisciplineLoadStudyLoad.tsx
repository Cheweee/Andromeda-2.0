import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, Grid, TextField, IconButton, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Autocomplete } from "@material-ui/lab";
import { ProjectType, ProjectTypes, StudyLoad } from "../../../models";
import { Delete } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly projectTypes: ProjectType[];
    studyLoad: StudyLoad[];

    onProjectTypeChange: (index: number, value: ProjectType) => void;
    onGroupsInStreamChange: (index: number, value: string) => void;
    onValueChange: (index: number, value: string) => void;
    onDeleteStudyLoad: (index: number) => void;
}

export const GroupDisciplineLoadStudyLoad = withStyles(styles)(function (props: Props) {
    const {
        classes,
        studyLoad,
        projectTypes,

        onProjectTypeChange,
        onGroupsInStreamChange,
        onValueChange,
        onDeleteStudyLoad
    } = props;
    return (
        <Grid>
            {studyLoad.length === 0 && (
                <Grid container direction="row" justify="center" alignItems="center">
                    <Typography color="textSecondary">Планируемые работы еще не были добавлены</Typography>
                </Grid>
            )}
            {studyLoad.length > 0 && props.studyLoad.map((o, index) => (
                <Grid key={index} container direction="row" alignItems="center">
                    <Grid item xs>
                        <Autocomplete
                            className={classes.w100}
                            noOptionsText={"Тип работ не найден"}
                            getOptionLabel={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
                            options={projectTypes}
                            value={o.projectType}
                            onChange={(event: React.ChangeEvent, value: ProjectType) => { onProjectTypeChange(index, value); }}
                            renderOption={(option: ProjectType) => `${ProjectType.getProjectTypeDescription(option)}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    label="Тип работ"
                                    placeholder="Выберите тип работ"
                                //TODO: Implement validation
                                // error={Boolean(formErrors.projectsTypesError)}
                                // helperText={formErrors.projectsTypesError}
                                />
                            )}
                        />
                    </Grid>
                    {o.projectType === ProjectType.lection && (
                        <Grid item xs={2} className={classes.margin1Left}>
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
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onGroupsInStreamChange(index, event && event.target.value)}
                            />
                        </Grid>
                    )}
                    <Grid item xs={2} className={classes.margin1Left}>
                        <TextField
                            label="Количество часов"
                            placeholder="Введите количество часов"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            inputProps={{ type: "number", min: 0.1, step: 1, max: 100 }}
                            value={o.projectType === ProjectType.lection ? StudyLoad.getComputedValue(o.shownValue) : o.value}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onValueChange(index, event && event.target.value)}
                        //disabled={disabled}
                        // error={Boolean(formErrors.semesterNumberError)}
                        // helperText={formErrors.semesterNumberError}
                        />
                    </Grid>
                    <Grid item xs="auto" className={classes.margin1Left}>
                        <IconButton onClick={() => onDeleteStudyLoad(index)}>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            )
            )}
        </Grid>
    );
});