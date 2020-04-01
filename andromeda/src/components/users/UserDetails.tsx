import * as React from "react";
import { Grid, TextField } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { User, UserValidation } from "../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    user: User;
    formErrors: UserValidation;

    handleFirstnameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSecondnameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleLastnameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        disabled,
        user,
        formErrors,

        handleFirstnameChange,
        handleSecondnameChange,
        handleLastnameChange,
        handleEmailChange,
        handleUsernameChange,
        handlePasswordChange
    } = props;
    return (
        <Grid container direction="column">
            <Grid container direction="row">
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="firstname"
                        name="firstname"
                        label="Имя"
                        placeholder="Введите имя пользователя"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        autoComplete="firstname"
                        disabled={disabled}
                        error={Boolean(formErrors.firstnameError)}
                        helperText={formErrors.firstnameError}
                        value={user.firstname}
                        onChange={handleFirstnameChange}
                    />
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="secondname"
                        name="secondname"
                        label="Отчество"
                        placeholder="Введите отчество пользователя"
                        margin="normal"
                        variant="outlined"
                        autoComplete="secondname"
                        fullWidth
                        disabled={disabled}
                        value={user.secondname || ''}
                        onChange={handleSecondnameChange}
                    />
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="lastname"
                        name="lastname"
                        label="Фамилия"
                        placeholder="Введите фамилию пользователя"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        autoComplete="familyname"
                        disabled={disabled}
                        value={user.lastname}
                        onChange={handleLastnameChange}
                        error={Boolean(formErrors.lastnameError)}
                        helperText={formErrors.lastnameError}
                    />
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="Введите email пользователя"
                        margin="normal"
                        variant="outlined"
                        autoComplete="email"
                        required
                        fullWidth
                        disabled={disabled}
                        error={Boolean(formErrors.emailError)}
                        helperText={formErrors.emailError}
                        value={user.email}
                        onChange={handleEmailChange}
                    />
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="username"
                        name="username"
                        label="Логин"
                        placeholder="Введите логин пользователя"
                        margin="normal"
                        variant="outlined"
                        autoComplete="username"
                        required
                        fullWidth
                        disabled={disabled || user.id > 0}
                        InputProps={{
                            readOnly: Boolean(user.id),
                        }}
                        error={Boolean(formErrors.usernameError)}
                        helperText={formErrors.usernameError}
                        value={user.username}
                        onChange={handleUsernameChange}
                    />
                </Grid>
                {!user.id &&
                    <Grid item xs className={classes.margin1X}>
                        <TextField
                            id="password"
                            name="password"
                            label="Пароль"
                            placeholder="Введите пароль"
                            margin="normal"
                            variant="outlined"
                            autoComplete="password"
                            required
                            fullWidth
                            disabled={disabled}
                            error={Boolean(formErrors.passwordError)}
                            helperText={formErrors.passwordError}
                            value={user.password}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                }
            </Grid>
        </Grid>
    )
});