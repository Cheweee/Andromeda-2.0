import * as React from "react";
import { mergeStyles, getShortening } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { DisciplineTitle, DisciplineTitleValidation } from "../../../models";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, TextField } from "@material-ui/core";
import { group } from "console";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disciplineTitle: DisciplineTitle;
    open: boolean;
    onCancel: () => void;
    onAccept: (title: DisciplineTitle) => void;
}

const initialTitle: DisciplineTitle = {
    name: '',
    shortname: ''
}

const initialValidation: DisciplineTitleValidation = {
    isValid: false
}

export const DisciplineTitleDetails = withStyles(styles)(function (props: Props) {
    const [title, setTitle] = useState(initialTitle);
    const [formErrors, setFormErrors] = useState(initialValidation);

    useEffect(() => {
        if (props.disciplineTitle) {
            setTitle(props.disciplineTitle);
        }
    }, [props.disciplineTitle]);

    useEffect(() => {
        const nameError = title.name ? '' : 'Наименование учебной дисциплины обязательно';
        const shortnameError = title.shortname ? '' : 'Краткое наименование учебной дисциплины обязательно';
        const isValid = !nameError && !shortnameError;

        setFormErrors({
            nameError,
            shortnameError,
            isValid
        });
    }, [title]);

    const {
        classes,
        open,
        onCancel,
        onAccept
    } = props;

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target && event.target.value;
        const shortname = getShortening(name);
        setTitle({ ...title, name, shortname });
    }

    const handleShortnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle({ ...title, shortname: event.target && event.target.value });
    }

    const handleAccept = () => {
        onAccept(title);
        setTitle(initialTitle);
    }

    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Наименование дисциплины</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <TextField
                        id="shortname"
                        name="shortname"
                        label="Сокращенное наименование"
                        placeholder={`Введите сокращенное наименование дисциплины`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        value={title.shortname}
                        onChange={handleShortnameChange}
                        error={Boolean(formErrors.shortnameError)}
                        helperText={formErrors.shortnameError}
                    />
                    <TextField
                        id="name"
                        name="name"
                        label="Наименование"
                        placeholder={`Введите наименование дисциплины`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        required
                        value={title.name}
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