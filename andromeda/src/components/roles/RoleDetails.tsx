import * as React from "react";

import { withStyles, WithStyles } from "@material-ui/core/styles";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { RoleValidation, Role } from "../../models";
import { Grid, TextField, FormControlLabel, Checkbox } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    role: Role;
    formErrors: RoleValidation;

    onRoleDetailsChange: (model: Role) => void;
}

export const RoleDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        disabled,
        role,
        formErrors
    } = props;

    function handleRoleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onRoleDetailsChange } = props;

        const newRole: Role = {
            ...role,
            name: event && event.target.value
        };

        onRoleDetailsChange(newRole);
    }

    function handleRoleCanTeachChange(event: React.ChangeEvent<HTMLInputElement>, value: boolean) {
        const { onRoleDetailsChange } = props;
        const newRole = { ...role, canTeach: value }

        onRoleDetailsChange(newRole);
    }
    
    function handleMaxLoadChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onRoleDetailsChange } = props;

        const value = parseFloat(event && event.target.value);

        const newRole: Role = {
            ...role,
            maxLoad: value
        };

        onRoleDetailsChange(newRole);
    }
    function handleMinLoadChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onRoleDetailsChange } = props;

        const value = parseFloat(event && event.target.value);

        const newRole: Role = {
            ...role,
            minLoad: value
        };

        onRoleDetailsChange(newRole);
    }

    return (
        <Grid container direction="column">
            <Grid container direction="row">
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="name"
                        name="name"
                        label="Наименование"
                        placeholder="Введите наименование роли"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        disabled={disabled}
                        value={role && role.name || ''}
                        onChange={handleRoleNameChange}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
                    />
                </Grid>
            </Grid>
            <FormControlLabel className={classes.margin1X}
                control={
                    <Checkbox
                        checked={role && role.canTeach || false}
                        onChange={handleRoleCanTeachChange}
                        color="primary"
                    />
                }
                label="Входит в преподавательский состав?"
            />
            <Grid container direction="row">
                {role && role.canTeach && (
                    <Grid item xs className={classes.margin1X}>
                        <TextField
                            id="minLoad"
                            name="minLoad"
                            label="Минимальная нагрузка"
                            placeholder="Введите минимальная нагрузку"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            disabled={disabled}
                            value={role && role.minLoad || ''}
                            InputProps={{ type: "number", endAdornment: "ч." }}
                            onChange={handleMinLoadChange}
                            error={Boolean(formErrors.minLoadError)}
                            helperText={formErrors.minLoadError}
                        />
                    </Grid>
                )}
                {role && role.canTeach && (
                    <Grid item xs className={classes.margin1X}>
                        <TextField
                            id="maxLoad"
                            name="maxLoad"
                            label="Максимальная нагрузка"
                            placeholder="Введите максимальную нагрузку"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            disabled={disabled}
                            value={role && role.maxLoad || ''}
                            InputProps={{ type: "number", endAdornment: "ч." }}
                            onChange={handleMaxLoadChange}
                            error={Boolean(formErrors.maxLoadError)}
                            helperText={formErrors.maxLoadError}
                        />
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
});