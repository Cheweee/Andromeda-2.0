import * as React from "react";
import { mergeStyles, getShortening } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { StudyDirection, StudyDirectionValidation } from "../../../models";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    selectedDirection: StudyDirection;
    open: boolean;
    onCancel: () => void;
    onAccept: (direction: StudyDirection) => void;
}

const initialStudyDirection: StudyDirection = {
    code: '',
    name: '',
    shortName: ''
}

const initialValidation: StudyDirectionValidation = {
    isValid: false,
}

export const StudyDirectionDetails = withStyles(styles)(function (props: Props) {
    const [studyDirection, setStudyDirection] = useState(initialStudyDirection);
    const [formErrors, setFormErrors] = useState(initialValidation);

    useEffect(() => {
        const { selectedDirection } = props;
        if (!selectedDirection)
            setStudyDirection(initialStudyDirection);
        else
            setStudyDirection(selectedDirection);
    }, [props.selectedDirection]);

    useEffect(() => {
        const codeError = studyDirection.code ? '' : 'Код направления подготовки обязателен.';
        const nameError = studyDirection.name ? '' : 'Наименование направления подготовки обязательно.';
        const shortNameError = studyDirection.shortName ? '' : 'Сокращение направления подготовки обязательно.';
        const isValid = !codeError && !nameError && !shortNameError;

        setFormErrors({
            codeError,
            nameError,
            shortNameError,
            isValid
        });
    }, [studyDirection]);

    const {
        classes,
        open,
        onCancel,
        onAccept
    } = props;

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudyDirection({ ...studyDirection, code: event.target && event.target.value });
    }

    const handleAccept = () => {
        onAccept(studyDirection);
        setStudyDirection(initialStudyDirection);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target && event.target.value;
        let shortName = getShortening(name);
        setStudyDirection({ ...studyDirection, name: name, shortName: shortName });
    }

    const handleShortNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudyDirection({ ...studyDirection, shortName: event.target && event.target.value });
    }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Направление подготовки</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Grid container>
                        <TextField
                            id="name"
                            name="name"
                            label="Наименование"
                            placeholder='Введите наименование направления подготовки'
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            value={studyDirection.name}
                            error={Boolean(formErrors.nameError)}
                            helperText={formErrors.nameError}
                            onChange={handleNameChange}
                        />
                    </Grid>
                    <Grid container direction="row">
                        <Grid item xs className={classes.margin1Right}>
                            <TextField
                                id="shortname"
                                name="shortname"
                                label="Сокращение"
                                placeholder='Введите сокращение направления подготовки'
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                required
                                value={studyDirection.shortName}
                                error={Boolean(formErrors.shortNameError)}
                                helperText={formErrors.shortNameError}
                                onChange={handleShortNameChange}
                            />
                        </Grid>
                        <Grid item xs className={classes.margin1Left}>
                            <TextField
                                id="code"
                                name="code"
                                label="Код направления подготовки"
                                placeholder='Введите код направления подготовки'
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                required
                                value={studyDirection.code}
                                error={Boolean(formErrors.codeError)}
                                helperText={formErrors.codeError}
                                onChange={handleCodeChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Отмена
                    </Button>
                <Button disabled={!formErrors.isValid} onClick={handleAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});