import * as React from "react";

import { withStyles, WithStyles } from "@material-ui/core/styles";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { RoleValidation, Role } from "../../models";
import { Grid, TextField } from "@material-ui/core";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    role: Role;
    formErrors: RoleValidation;
    
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoleDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        disabled,
        role,
        formErrors,

        handleNameChange
    } = props;
    
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
                        autoComplete="firstname"
                        disabled={disabled}
                        value={role.name}
                        onChange={handleNameChange}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
});