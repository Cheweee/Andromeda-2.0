import * as React from "react";
import { Grid, TextField } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { User, UserValidation } from "../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    isUserExist: boolean;
    user: User;
    formErrors: UserValidation;

    onUserDetailsChange: (model: User) => void;
}

export const UserDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        disabled,
        isUserExist,
        user,
        formErrors
    } = props;

    function handleFirstnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            firstname: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }
    function handleSecondnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            secondname: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }
    function handleLastnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            lastname: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }
    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            email: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }
    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            username: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }
    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onUserDetailsChange } = props;

        const changedUser: User = {
            ...user,
            password: event && event.target.value
        }
        onUserDetailsChange(changedUser);
    }

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
                        value={user && user.firstname || ''}
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
                        value={user && user.secondname || ''}
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
                        value={user && user.lastname || ''}
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
                        value={user && user.email || ''}
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
                        disabled={disabled || isUserExist}
                        InputProps={{
                            readOnly: isUserExist,
                        }}
                        error={Boolean(formErrors.usernameError)}
                        helperText={formErrors.usernameError}
                        value={user && user.username || ''}
                        onChange={handleUsernameChange}
                    />
                </Grid>
                {!isUserExist &&
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
                            value={user && user.password || ''}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                }
            </Grid>
        </Grid>
    )
});