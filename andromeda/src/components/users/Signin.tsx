import * as React from 'react';
import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { Grid, Paper, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, CircularProgress, Link } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Face } from '@material-ui/icons';

import { mergeStyles } from '../../utilities';
import { commonStyles, layoutStyles, authenticateStyles } from '../../muiTheme';
import { AuthenticatedUser, ApplicationError, UserValidation } from '../../models';
import { sessionService, userService } from '../../services';

import clsx from "clsx";

const styles = mergeStyles(layoutStyles, authenticateStyles, commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Signin = withStyles(styles)(function (props: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<UserValidation>({ isValid: false });

    useEffect(() => {
        const formErrors = userService.validateCredentials(username, password);
        setFormErrors(formErrors);
    }, [username, password])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { history } = props;

        setLoading(true);

        try {
            const result: AuthenticatedUser = await userService.signin({ username, password, rememberMe });

            if (result && result.token) {
                if (sessionService.signIn(result.token) && history) {
                    history.push('/');
                }
            }
            else {
                setLoading(false);
                setPassword('');
                setMessage('Неправильное имя пользователя или пароль');
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setMessage(error.message);
            }
        }
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
                            {message && <Typography variant="subtitle2" component="h6" color="error" className={classes.submitMessage}>{message}</Typography>}
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
        </Grid >
    );
});