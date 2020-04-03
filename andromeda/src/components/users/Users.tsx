import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Search, Edit, Delete, Add, SupervisorAccount } from '@material-ui/icons';
import {
    Paper,
    Grid,
    Typography,
    IconButton,
} from '@material-ui/core';

import { mergeStyles } from '../../utilities';
import { commonStyles } from '../../muiTheme';
import { User, ApplicationError, UserAuthenticateOptions, UserGetOptions} from '../../models';
import { Column, SnackbarVariant, Filter } from '../../models/commonModels';
import { TableComponent, ConfirmationDialog, SearchInput, MessageSnackbar } from '../common';
import { paths } from '../../sharedConstants';
import { useSnackbarState, useFilterState } from '../../hooks';
import { UserState, userActions, UserActionsProps } from '../../store/userStore';
import { AppState } from '../../store/createStore';

const styles = mergeStyles(commonStyles);

interface UsersStateProps {
    state: UserState;
}

function mapStateToProps(state: AppState): UsersStateProps {
    return { state: state.user };
}
function mapDispatchToProps(dispatch): UserActionsProps {
    return {
        createUser: (user: User) => dispatch(userActions.createUser(user)),
        deleteUsers: (ids: number[]) => dispatch(userActions.deleteUsers(ids)),
        getUsers: (options: UserGetOptions) => dispatch(userActions.getUsers(options)),
        signin: (options: UserAuthenticateOptions) => dispatch(userActions.signin(options)),
        signout: () => userActions.signout(),
        updateUser: (user: User) => dispatch(userActions.updateUser(user)),
        validateCredentials: (username: string, password: string) => userActions.validateCredentials(username, password),
        validateUser: (user: User) => userActions.validateUser(user)
    };
};

interface Props extends UsersStateProps, UserActionsProps, RouteComponentProps, WithStyles<typeof styles> {
}

export const Users = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(function (props: Props) {
    const [users, setUsers] = React.useState<User[]>([]);
    const [filter, setFilter] = useFilterState(Filter.initial);
    const [id, setId] = React.useState<number>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [snackbar, setSnackbar] = useSnackbarState();
    const [open, setOpen] = React.useState<boolean>(false);

    React.useEffect(() => { props.getUsers({ search: filter.search });}, [])
    React.useEffect(() => { 
        const { state } = props;

        if(state.loading === true) {
            setLoading(true);
            return;
        }

        setLoading(false);
        setUsers(state.users);
    }, [props.state]);

    function handleAdd() {
        const { history } = props;
        history.push(paths.getUserPath('create'));
    }

    function handleEdit(user: User) {
        const { history } = props;
        history.push(paths.getUserPath(`${user.id}`));
    }

    function handleDelete(id: number) {
        setId(id);
        setOpen(true);
    }

    async function handleConfirmationClose(result: boolean) {
        try {
            setOpen(false);
            if (result) {
                const ids = [id];
                await userActions.deleteUsers(ids);
                setSnackbar('Пользователь успешно удален.', true, SnackbarVariant.success);
                //await getUsers();
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setId(null);
        }
    }

    async function handleSearchChange(value: string) {
        setFilter(value);
    }

    const { classes } = props;

    const columns: Column[] = [
        { name: 'username', displayName: 'Имя пользователя' },
        {
            name: 'edit', padding: "checkbox", displayName: '', render: (data: User) => (
                <IconButton onClick={() => handleEdit(data)}>
                    <Edit />
                </IconButton>
            )
        },
        { name: 'firstname', displayName: 'Имя' },
        { name: 'secondname', displayName: 'Отчество' },
        { name: 'lastname', displayName: 'Фамилия' },
        { name: 'email', displayName: 'Email' },
        {
            name: 'delete', padding: "checkbox", displayName: '', render: (data: User) => (
                <IconButton onClick={() => handleDelete(data.id)}>
                    <Delete />
                </IconButton>
            )
        },
    ]

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <SupervisorAccount color="primary" />
                <Typography>Пользователи</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={handleSearchChange}
                    //onSearch={getUsers}
                />
                <IconButton onClick={handleAdd}>
                    <Add />
                </IconButton>
            </Grid>
            <Paper className={classes.margin1Y}>
                <TableComponent columns={columns} data={users} loading={loading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить пользователя?'}
                onClose={handleConfirmationClose}
            />
            <MessageSnackbar
                variant={snackbar.variant}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar('', false, undefined)}
            />
        </Grid >
    );
})));