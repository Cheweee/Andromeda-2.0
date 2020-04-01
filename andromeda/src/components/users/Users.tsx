import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { mergeStyles } from '../../utilities';
import { commonStyles } from '../../muiTheme';
import { User, ApplicationError } from '../../models';
import { userService } from '../../services/userService';
import {
    Paper,
    Grid,
    Typography,
    InputBase,
    IconButton,
} from '@material-ui/core';
import { Search, Edit, Delete, Add, SupervisorAccount } from '@material-ui/icons';
import { IFilter, Column, SnackbarVariant, Filter } from '../../models/commonModels';
import { TableComponent, ConfirmationDialog, SearchInput, MessageSnackbar } from '../common';
import { RouteComponentProps, withRouter } from 'react-router';
import { paths } from '../../sharedConstants';
import { useEffect, useState } from 'react';
import { useSnackbarState, useFilterState } from '../../hooks';

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Users = withStyles(styles)(withRouter(function (props: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useFilterState(Filter.initial);
    const [id, setId] = useState<number>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useSnackbarState();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => { getUsers(); }, [props])

    async function getUsers() {
        try {
            setLoading(true);
            const users = await userService.get({ search: filter.search });
            setUsers(users);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
        }
    }

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
                await userService.delete(ids);
                setSnackbar('Пользователь успешно удален.', true, SnackbarVariant.success);
                await getUsers();
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
                    onSearch={getUsers}
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
}));