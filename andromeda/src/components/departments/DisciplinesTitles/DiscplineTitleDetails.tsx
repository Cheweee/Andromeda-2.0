import * as React from "react";
import { mergeStyles, getShortening } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { DisciplineTitle, DisciplineTitleValidation, Validation } from "../../../models";
import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, TextField } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disciplineTitle: DisciplineTitle;
    open: boolean;
    onCancel: () => void;
    onAccept: (title: DisciplineTitle) => void;
}

export const DisciplineTitleDetails = withStyles(styles)(function (props: Props) {
    const [name, setName] = React.useState<string>('');
    const [shortname, setShortname] = React.useState<string>('');
    const [formErrors, setFormErrors] = React.useState<DisciplineTitleValidation>(Validation.initial);

    React.useEffect(() => {
        setName(props.disciplineTitle ? props.disciplineTitle.name : '');
        setShortname(props.disciplineTitle ? props.disciplineTitle.shortname : '');
    }, [props.disciplineTitle]);

    React.useEffect(() => {
        const nameError = name ? '' : 'Наименование учебной дисциплины обязательно';
        const shortnameError = shortname ? '' : 'Краткое наименование учебной дисциплины обязательно';
        const isValid = !nameError && !shortnameError;

        setFormErrors({
            nameError,
            shortnameError,
            isValid
        });
    }, [name, shortname]);

    const {
        classes,
        open,
        onCancel,
        onAccept
    } = props;

    function handleNameChange (event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target && event.target.value;
        const shortname = getShortening(name);
        setName(name);
        setShortname(shortname);
    }

    function handleShortnameChange (event: React.ChangeEvent<HTMLInputElement>) {
        setShortname(event.target && event.target.value);
    }

    function handleAccept() {
        onAccept({ name, shortname });
        setName('');
        setShortname('');
    }

    function handleCancel() {
        onCancel();
        setName('');
        setShortname('');
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
                        value={shortname}
                        onChange={handleShortnameChange}
                        error={Boolean(formErrors.shortnameError)}
                        helperText={formErrors.shortnameError}
                    />
                    <TextField
                        id="disciplineTitlename"
                        name="name"
                        label="Наименование"
                        placeholder={`Введите наименование дисциплины`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
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