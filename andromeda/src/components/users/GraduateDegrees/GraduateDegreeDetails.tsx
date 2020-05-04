import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/styles";

import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { GraduateDegree, BranchOfScience, GraduateDegrees, UserGraduateDegreeValidation } from "../../../models";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    branchesOfSciences: BranchOfScience[];

    graduateDegree: GraduateDegree;
    branchOfScience: BranchOfScience;

    open: boolean;

    onAccept: (graduateDegree: GraduateDegree, branchOfScience: BranchOfScience) => void;
    onCancel: () => void;
}

export const GraduateDegreeDetails = withStyles(styles)(function (props: Props) {
    const [graduateDegree, setGraduateDegree] = React.useState<GraduateDegree>(null);
    const [branchOfScience, setBranchOfScience] = React.useState<BranchOfScience>(null);
    const [formErrors, setFormErrors] = React.useState<UserGraduateDegreeValidation>(UserGraduateDegreeValidation.initial);

    React.useEffect(() => { setGraduateDegree(props.graduateDegree); }, [props.graduateDegree]);

    React.useEffect(() => { setBranchOfScience(props.branchOfScience); }, [props.branchOfScience]);

    React.useEffect(() => {
        const graduateDegreeError = graduateDegree !== null ? '' : 'Выберите ученую степень.';
        const branchOfScienceError = branchOfScience !== null ? '' : 'Выберите отрасль науки.';
        const isValid = !graduateDegreeError && !branchOfScienceError;

        setFormErrors({
            graduateDegreeError,
            branchOfScienceError,
            isValid
        });
    }, [graduateDegree, branchOfScience]);

    const {
        classes,

        branchesOfSciences,

        open,

        onAccept,
        onCancel
    } = props;

    function handleGraduateDegreeChange (event: React.ChangeEvent, value: GraduateDegree) {
        setGraduateDegree(value);
    }

    function handleBranchOfScienceChange (event: React.ChangeEvent, value: BranchOfScience) {
        setBranchOfScience(value);
    }

    function handleAccept() {
        onAccept(graduateDegree, branchOfScience);
        setGraduateDegree(null);
        setBranchOfScience(null);
    }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Ученая степень пользователя</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Autocomplete
                        className={classes.w100}
                        noOptionsText={"Ученая степень не найдена"}
                        getOptionLabel={(option: GraduateDegree) => `${GraduateDegree.getGraduateDegreeDescription(option)}`}
                        options={GraduateDegrees}
                        value={graduateDegree}
                        onChange={handleGraduateDegreeChange}
                        renderOption={(option: GraduateDegree) => `${GraduateDegree.getGraduateDegreeDescription(option)}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Ученая степень"
                                placeholder="Выберите ученую степень"
                                error={Boolean(formErrors.graduateDegreeError)}
                                helperText={formErrors.graduateDegreeError}
                            />
                        )}
                    />
                    <Autocomplete
                        className={classes.w100}
                        noOptionsText={"Отрасль науки не найдена"}
                        getOptionLabel={(option: BranchOfScience) => `${BranchOfScience.getBranchOfScienceDescription(option)}`}
                        options={branchesOfSciences}
                        value={branchOfScience}
                        onChange={handleBranchOfScienceChange}
                        renderOption={(option: BranchOfScience) => `${BranchOfScience.getBranchOfScienceDescription(option)}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Отрасль науки"
                                placeholder="Выберите отрасль науки"
                                error={Boolean(formErrors.branchOfScienceError)}
                                helperText={formErrors.branchOfScienceError}
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
    )
});