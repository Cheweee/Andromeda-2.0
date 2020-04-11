import * as React from 'react';

import * as Redux from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Search, Edit, Delete, Add, SupervisorAccount } from '@material-ui/icons';
import { Paper, Grid, Typography, IconButton } from '@material-ui/core';

import { TableComponent, ConfirmationDialog, SearchInput } from '../common';

import { commonStyles } from '../../muiTheme';
import { User, Column, AppState } from '../../models';

import { userActions } from '../../store/userStore';

import { useDebounce } from '../../hooks';
import { paths } from '../../sharedConstants';
import { mergeStyles } from '../../utilities';

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
}

export const Users = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { userState } = Redux.useSelector((state: AppState) => ({ userState: state.userState }));

    const [search, setSearch] = React.useState<string>();
    const [id, setId] = React.useState<number>(null);
    const [open, setOpen] = React.useState<boolean>(false);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => getUsers(), []);
    React.useEffect(() => { getUsers(debouncedSearch); }, [debouncedSearch]);

    function getUsers(search?: string) {
        dispatch(userActions.getUsers({ search: search }));
    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getUserPath('create'));
    }

    function handleEdit(model: User) {
        const { history } = props;
        history.push(paths.getUserPath(`${model.id}`));
    }

    function handleDelete(id: number) {
        setId(id);
        setOpen(true);
    }

    async function handleConfirmationClose(result: boolean) {
        setOpen(false);
        if (result) {
            const ids = [id];
            await dispatch(userActions.deleteUsers(ids));
        }
        setId(null);
    }

    function handleSearchChange(value: string) {
        setSearch(value);
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

    let users: User[] = [];

    if(userState.usersLoading === false) {
        users = userState.users;
    }

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <SupervisorAccount color="primary" />
                <Typography>Пользователи</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    search={search}
                    onSearchChange={handleSearchChange}
                />
                <IconButton onClick={handleAdd}>
                    <Add />
                </IconButton>
            </Grid>
            <Paper className={classes.margin1Y}>
                <TableComponent columns={columns} data={users} loading={userState.usersLoading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить пользователя?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));