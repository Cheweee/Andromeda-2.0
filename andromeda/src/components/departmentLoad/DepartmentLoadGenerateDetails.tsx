import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { WithStyles, withStyles, Dialog, DialogTitle, DialogContent, Grid, FormControlLabel, Checkbox, DialogActions, Button } from "@material-ui/core";
import { DepartmentLoadGenerateOptions } from "../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    open: boolean;

    onAccept: (options: DepartmentLoadGenerateOptions) => void;
    onCancel: () => void;
}

export const DepartmentLoadGenerateDetails = withStyles(styles)(function (props: Props) {
    const [options, setOptions] = React.useState<DepartmentLoadGenerateOptions>(DepartmentLoadGenerateOptions.initial);

    const {
        classes,

        open,

        onAccept,
        onCancel
    } = props;

    function handleUseTeachingExperience(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            useTeachingExperience: checked
        };

        setOptions(newOptions);
    }

    function handleUseMethodicalDevelopments(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            useMethodicalDevelopments: checked
        };

        setOptions(newOptions);
    }

    function handleUseFinalTestsResults(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            useFinalTestsResults: checked
        };

        setOptions(newOptions);
    }

    function handleUseIndependetTestsResults(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            useIndependetTestsResults: checked
        };

        setOptions(newOptions);
    }

    function handleUseGraduateDegrees(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            useGraduateDegrees: checked
        };

        setOptions(newOptions);
    }

    function handleUsePinnedDisciplines(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        const newOptions: DepartmentLoadGenerateOptions = {
            ...options,
            usePinnedDisciplines: checked
        };

        setOptions(newOptions);
    }

    function handleAccept() { onAccept(options); }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Параметры расчета нагрузки</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.useTeachingExperience}
                                onChange={handleUseTeachingExperience}
                                value="UseTeachingExperience"
                            />
                        }
                        label="Использовать стаж преподавателя?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.useMethodicalDevelopments}
                                onChange={handleUseMethodicalDevelopments}
                                value="UseMethodicalDevelopments"
                            />
                        }
                        label="Использовать методические разработки преподавателя?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.useFinalTestsResults}
                                onChange={handleUseFinalTestsResults}
                                value="FinalTestsResults"
                            />
                        }
                        label="Использовать результаты сессия?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.useIndependetTestsResults}
                                onChange={handleUseIndependetTestsResults}
                                value="UseIndependetTestsResults"
                            />
                        }
                        label="Использовать результаты независимой аттестации студентов?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.useGraduateDegrees}
                                onChange={handleUseGraduateDegrees}
                                value="UseGraduateDegrees"
                            />
                        }
                        label="Использовать ученые степени?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.usePinnedDisciplines}
                                onChange={handleUsePinnedDisciplines}
                                value="UsePinnedDisciplines"
                            />
                        }
                        label="Использовать закрепленные за преподавателем дисциплины?"
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Отмена
                    </Button>
                <Button onClick={handleAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});