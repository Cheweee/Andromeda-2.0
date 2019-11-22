import * as React from "react";
import { RouteComponentProps } from "react-router";

import { WithStyles, withStyles } from "@material-ui/styles";
import { Grid, Card, CardContent, CardHeader, Tooltip, IconButton, TextField, LinearProgress } from "@material-ui/core";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Check, Close, ArrowBack } from "@material-ui/icons";
import { paths } from "../../sharedConstants";

import clsx from "clsx";
import { User, UserValidation, ApplicationError } from '../../models';
import { userService } from "../../services";
import { MessageSnackbar } from "../common";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    user: User;
    formErrors: UserValidation;
    loading: boolean;
    snackbarOpen: boolean;
    snackbarVariant: "success" | "error";
    snackbarMessage: string;
}

class UserBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: {
                email: '',
                firstname: '',
                lastname: '',
                username: ''
            },
            formErrors: { isValid: false },
            loading: false,
            snackbarOpen: false,
            snackbarVariant: undefined,
            snackbarMessage: ''
        }
    }

    async componentDidMount() {
        await this.loadUser();
    }

    private loadUser = async () => {
        const {
            match
        } = this.props;

        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, 0);
        if (id) {
            try {
                this.setState({
                    loading: true
                })
                const users = await userService.get({ id });
                const user = users[0];
                this.setState({
                    user: {
                        email: user.email,
                        firstname: user.firstname,
                        id: user.id,
                        lastname: user.lastname,
                        password: user.password,
                        secondname: user.secondname || '',
                        username: user.username

                    },
                    loading: false
                }, this.validateUser);
            }
            catch (error) {
                if (error instanceof ApplicationError) {
                    this.setState({
                        loading: false,
                        snackbarMessage: error.message,
                        snackbarOpen: true,
                        snackbarVariant: "error"
                    })
                }
            }
        }
        else {
            this.setState({
                user: {
                    email: '',
                    firstname: '',
                    lastname: '',
                    username: ''
                }
            }, this.validateUser)
        }
    }

    private validateUser = () => {
        const {
            user
        } = this.state;
        const formErrors = userService.validateUser(user);
        this.setState({
            formErrors
        })
    }

    private handleSnackbarClose = () => {
        this.setState({
            snackbarMessage: '',
            snackbarOpen: false,
            snackbarVariant: undefined
        })
    }

    private handleBackClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            history
        } = this.props;
        history.push(paths.usersPath);
    }

    private handleSaveClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        const {
            user
        } = this.state;

        try {
            this.setState({
                loading: true
            });
            if (user.id)
                await userService.update(user);
            else
                await userService.create(user);
            this.setState({
                loading: false,
                snackbarMessage: 'Пользователь успешно сохранен',
                snackbarOpen: true,
                snackbarVariant: "success"
            });
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                this.setState({
                    loading: false,
                    snackbarMessage: error.message,
                    snackbarOpen: true,
                    snackbarVariant: "error"
                })
            }
        }
    }

    private handleCancelClick = async (event: React.MouseEvent<Element, MouseEvent>) => {
        await this.loadUser();
    }

    private handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, firstname: event.target && event.target.value },
        }, this.validateUser);
    }

    private handleSecondnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, secondname: event.target && event.target.value },
        });
    }

    private handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, lastname: event.target && event.target.value },
        }, this.validateUser);
    }

    private handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, email: event.target && event.target.value },
        }, this.validateUser);
    }

    private handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, username: event.target && event.target.value },
        }, this.validateUser);
    }

    private handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { user } = this.state;
        this.setState({
            user: { ...user, password: event.target && event.target.value }
        }, this.validateUser);
    }

    render() {
        const { classes } = this.props;
        const {
            user,
            loading,
            formErrors,
            snackbarOpen,
            snackbarVariant,
            snackbarMessage
        } = this.state;

        return (
            <form autoComplete="off" noValidate>
                <Grid container direction="row">
                    <Grid item xs={2} />
                    <Grid item xs container direction="column">
                        <Grid container direction="row">
                            <Tooltip title="Вернуться назад">
                                <IconButton disabled={loading} onClick={this.handleBackClick}>
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            <Grid item xs />
                            <Tooltip title="Отменить">
                                <IconButton disabled={loading} onClick={this.handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Сохранить">
                                <IconButton color="primary" disabled={loading || !formErrors.isValid} onClick={this.handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Card className={clsx(classes.margin1Y, classes.w100)}>
                            <CardHeader
                                title="Пользователь"
                            />
                            {loading && <LinearProgress variant="query" />}
                            <CardContent>
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
                                                disabled={loading}
                                                error={Boolean(formErrors.firstnameError)}
                                                helperText={formErrors.firstnameError}
                                                value={user.firstname}
                                                onChange={this.handleFirstnameChange}
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
                                                disabled={loading}
                                                value={user.secondname || ''}
                                                onChange={this.handleSecondnameChange}
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
                                                disabled={loading}
                                                value={user.lastname}
                                                onChange={this.handleLastnameChange}
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
                                                disabled={loading}
                                                error={Boolean(formErrors.emailError)}
                                                helperText={formErrors.emailError}
                                                value={user.email}
                                                onChange={this.handleEmailChange}
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
                                                disabled={loading}
                                                InputProps={{
                                                    readOnly: Boolean(user.id),
                                                }}
                                                error={Boolean(formErrors.usernameError)}
                                                helperText={formErrors.usernameError}
                                                value={user.username}
                                                onChange={this.handleUsernameChange}
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
                                                    disabled={loading}
                                                    error={Boolean(formErrors.passwordError)}
                                                    helperText={formErrors.passwordError}
                                                    value={user.password}
                                                    onChange={this.handlePasswordChange}
                                                />
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={2} />
                    <MessageSnackbar
                        variant={snackbarVariant}
                        message={snackbarMessage}
                        open={snackbarOpen}
                        onClose={this.handleSnackbarClose}
                    />
                </Grid>
            </form>
        );
    }
}

export const UserComponent = withStyles(styles)(UserBase);