import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import * as Redux from 'react-redux';

import { Grid, Paper, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, CircularProgress, Link } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Face } from '@material-ui/icons';

import { mergeStyles } from '../../utilities';
import { commonStyles, layoutStyles, authenticateStyles } from '../../muiTheme';
import { UserValidation, SnackbarVariant } from '../../models';

import clsx from "clsx";
import { AppState } from '../../models/reduxModels';
import { userActions } from '../../store/userStore';
import { MessageSnackbar } from '../common';
import { snackbarActions } from '../../store/snackbarStore';

const styles = mergeStyles(layoutStyles, authenticateStyles, commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Signin = withStyles(styles)(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { userState, snackbarState } = Redux.useSelector((state: AppState) => ({
        userState: state.userState,
        snackbarState: state.snackbarState
    }));

    const [variant, setVariant] = React.useState<SnackbarVariant>(SnackbarVariant.info);
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');

    const [loading, setLoading] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const [formErrors, setFormErrors] = React.useState<UserValidation>({ isValid: false });

    React.useEffect(() => {
        if (snackbarState.show !== true) {
            setOpen(false);
            return;
        }

        setVariant(snackbarState.variant);
        setMessage(snackbarState.message);
        setOpen(true);
    }, [snackbarState]);
    React.useEffect(() => { setFormErrors(userState.formErrors); }, [userState.formErrors]);
    React.useEffect(() => { dispatch(userActions.validateCredentials(username, password)); }, [username, password]);
    React.useEffect(() => {
        setLoading(userState.authenticating);
        if (userState.authenticating === false) {
            if (userState.authenticated === true) {
                const { history } = props;
                history.push('/');
            } else {
                setPassword('');
            }
        }
    }, [userState.authenticating])

    function handleSnackbarClose() { dispatch(snackbarActions.hideSnackbar()); }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(userActions.signin({ username, password, rememberMe }));
    }

    function handleUserNameChange(event: React.ChangeEvent<HTMLInputElement>) { setUsername(event.target && event.target.value); }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) { setPassword(event.target && event.target.value); }

    function handleRememberMeChange(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) { setRememberMe(checked); }

    const { classes } = props;

    return (
        <Grid container component="main" className={clsx(classes.root, classes.h100)} >
            <Grid item xs={false} sm={6} md={8} className={classes.fulllogo} >
            </Grid>
            <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
                <Grid className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Face />
                    </Avatar>
                    <Typography component="h1" variant="h5">

                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            required
                            fullWidth
                            autoFocus
                            variant="outlined"
                            margin="normal"
                            placeholder="Введите имя пользователя"
                            id="userName"
                            label="Имя пользователя"
                            name="userName"
                            autoComplete="username"
                            value={username}
                            onChange={handleUserNameChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <FormControlLabel
                            control={<Checkbox value={rememberMe} onChange={handleRememberMeChange} color="primary" />}
                            label="Запомнить меня"
                        />
                        <div className={classes.submit}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading || !formErrors.isValid}
                            >
                                <div>Авторизоваться</div>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Button>
                        </div>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" variant="body2">
                                    Забыли пароль?
                                    </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/sign-up" variant="body2">
                                    Еще нет аккаунта?
                                    </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <MessageSnackbar
                variant={variant}
                open={open}
                message={message}
                onClose={handleSnackbarClose}
            />
        </Grid >
    );
});