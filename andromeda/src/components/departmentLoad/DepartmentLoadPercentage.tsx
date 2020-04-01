import * as React from "react";
import { useEffect, useState } from "react";

import { withStyles, WithStyles, Grid, Typography, Card, CardContent, Paper, TextField, InputAdornment, IconButton, Tooltip } from "@material-ui/core";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { PercentageCircularProgress } from "../common";
import { Edit, Check, Close } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly percentage: number;
    readonly unallocatedStudyLoad: number;
    readonly totalLoad: number;

    studyYearEdit: boolean;
    studyYear: string;

    onStudyYearEdit: () => void;
    onStudyYearSave: (newValue: string) => void;
    onStudyYearCancel: () => void;
}
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

export const DepartmentLoadPercentage = withStyles(styles)(function (props: Props) {
    const [studyYear, setStudyYear] = useState<string>(currentYear + ' - ' + nextYear);
    const [studyYearErrors, setStudyYearErrors] = useState<string>('');

    useEffect(() => {
        setStudyYear(props.studyYear);
        validateStudyYear(props.studyYear);
    }, [props.studyYear, props.studyYearEdit]);

    const {
        classes,

        percentage,
        unallocatedStudyLoad,
        totalLoad,
        studyYearEdit,

        onStudyYearEdit,
        onStudyYearSave
    } = props;

    function validateStudyYear(value: string) {
        const format = /\d{4}\s?-\s?\d{4}$/g;        

        if (!format.test(value)) {
            setStudyYearErrors("Правильный формат: ГГГГ - ГГГГ");
        } else {
            setStudyYearErrors('');
        }
    }

    function handleStudyYearChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target && event.target.value;
        setStudyYear(value);
        validateStudyYear(value);
    }

    function handleStudyYearCancel() {
        const { studyYear, onStudyYearCancel } = props;
        setStudyYear(studyYear);
        onStudyYearCancel();
    }

    return (
        <Grid container direction="column">
            <Grid>
                <Grid container direction="row" alignItems="center">
                    <Typography>Учебный год</Typography>
                    <Grid item xs />
                    {studyYearEdit ? (
                        <Grid>
                            <Tooltip title="Отменить">
                                <span>
                                    <IconButton onClick={handleStudyYearCancel}>
                                        <Close />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Сохранить год обучения">
                                <span>
                                    <IconButton color="primary" disabled={Boolean(studyYearErrors)} onClick={() => { onStudyYearSave(studyYear); }}>
                                        <Check />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    ) : (
                            <Tooltip title="Редактировать год обучения">
                                <span>
                                    <IconButton onClick={onStudyYearEdit}>
                                        <Edit />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                </Grid>
                <Paper className={classes.margin1Y}>
                    <TextField
                        id="studyYear"
                        placeholder="Введите учебный год"
                        variant="outlined"
                        fullWidth
                        required
                        inputProps={{ readOnly: !studyYearEdit }}
                        InputProps={{ endAdornment: <InputAdornment position="end">г.</InputAdornment> }}
                        //disabled={disabled}
                        error={Boolean(studyYearErrors)}
                        helperText={studyYearErrors}
                        value={studyYear}
                        onChange={handleStudyYearChange}
                    />
                </Paper>
            </Grid>
            <Grid className={classes.margin2Top}>
                <Typography>Прогресс</Typography>
                <Card className={classes.margin1Y}>
                    <CardContent>
                        <Grid container direction="column" alignItems="center" justify="space-between">
                            <PercentageCircularProgress size={140} variant="static" value={percentage} />
                        </Grid>
                        <Grid container direction="column">
                            <Grid container direction="row" justify="space-between">
                                <Typography variant="h6">Осталось: </Typography>
                                <Typography variant="h6">{unallocatedStudyLoad.toFixed(2)}ч.</Typography>
                            </Grid>
                            <Grid container direction="row" justify="space-between">
                                <Typography variant="h6">Всего нагрузки: </Typography>
                                <Typography variant="h6">{totalLoad.toFixed(2)}ч.</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
});