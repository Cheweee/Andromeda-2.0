import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Grid, Paper, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, CircularProgress, Link } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/styles';
import { Face } from '@material-ui/icons';

import { mergeStyles } from '../../utilities';
import { commonStyles, layoutStyles, authenticateStyles } from '../../muiTheme';
import { AuthenticatedUser, ApplicationError, UserValidation } from '../../models';
import { sessionService, userService } from '../../services';

const styles = mergeStyles(layoutStyles, authenticateStyles, commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    loading: boolean;
    message: string;
    username: string;
    password: string;
    rememberMe?: boolean;
    formErrors?: UserValidation;
}

class SigninBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            message: '',
            username: '',
            password: '',
            rememberMe: false,
            formErrors: { isValid: false }
        };
    }

    private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { username, password, rememberMe } = this.state;
        const { history } = this.props;

        this.setState({
            loading: true
        });

        try {
            const result: AuthenticatedUser = await userService.signin({ username, password, rememberMe });

            if (result && result.token) {
                if (sessionService.signIn(result.token) && history) {
                    history.push('/');
                }
            }
            else {
                this.setState({
                    loading: false,
                    password: '',
                    message: 'Неправильное имя пользователя или пароль'
                })
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                this.setState({
                    loading: false,
                    message: error.message
                });
            }
        }
    }

    private handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            username: event.target && event.target.value,
            message: ''
        }, this.validateCredentials);
    }

    private handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: event.target && event.target.value,
            message: ''
        }, this.validateCredentials);
    }

    private handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.setState({
            rememberMe: checked
        });
    }

    private validateCredentials() {
        const { username, password } = this.state;
        const formErrors = userService.validateCredentials(username, password);
        this.setState({ formErrors });
    }

    render() {
        const {
            classes
        } = this.props;
        const {
            username,
            password,
            rememberMe,
            loading,
            message,
            formErrors
        } = this.state;

        return (
            <Grid container component="main" className={classes.root}>
                <Grid item xs={false} sm={6} md={7} className={classes.fulllogo} >
                </Grid>
                <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
                    <Grid className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <Face />
                        </Avatar>
                        <Typography component="h1" variant="h5">

                        </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
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
                                onChange={this.handleUserNameChange}
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
                                onChange={this.handlePasswordChange}
                            />
                            <FormControlLabel
                                control={<Checkbox value={rememberMe} onChange={this.handleRememberMeChange} color="primary" />}
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
            </Grid>
        );
    }
}

export const Signin = withStyles(styles)(SigninBase);