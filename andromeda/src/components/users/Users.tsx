import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/styles';

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
import { Filter, Column } from '../../models/commonModels';
import { TableComponent, ConfirmationDialog, SearchInput } from '../common';
import { RouteComponentProps, withRouter } from 'react-router';
import { paths } from '../../sharedConstants';

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    users: User[];
    filter?: Filter;
    id?: number;
    loading: boolean;
    open: boolean;
}

class UsersBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            users: [],
            filter: {
                debounce: 500,
                search: ''
            },
            loading: false,
            open: false
        };
    }

    async componentDidMount() {
        await this.getUsers();
    }

    private getUsers = async () => {
        const { filter } = this.state;
        this.setState({ loading: true });
        try {
            const users = await userService.get({ search: filter.search });

            this.setState({ users });
        }
        catch (error) {
            if (error instanceof ApplicationError) {
            }
        }

        this.setState({ loading: false });
    }

    private handleAdd = () => {
        const {
            history
        } = this.props;
        history.push(paths.getUserPath('create'));
    }

    private handleEdit = (user: User) => {
        const {
            history
        } = this.props;
        history.push(paths.getUserPath(`${user.id}`));
    }

    private handleDelete = (id: number) => {
        this.setState({
            id: id,
            open: true
        });
    }

    private handleConfirmationClose = async (result: boolean) => {
        this.setState({
            open: false,
        })

        if (result) {
            const { id } = this.state;
            const ids = [id];
            await userService.delete(ids);
            await this.getUsers();
        }

        this.setState({
            id: null,
        });
    }

    private handleSearchChange = async (value: string) => {
        const {
            filter
        } = this.state;
        this.setState({
            filter: { ...filter, search: value }
        });
    }

    render() {
        const {
            classes
        } = this.props;
        const {
            open,
            loading,
            filter,
            users
        } = this.state;

        const columns: Column[] = [
            { name: 'username', displayName: 'Имя пользователя' },
            {
                name: 'edit', padding: "checkbox", displayName: '', render: (data: User) => (
                    <IconButton onClick={() => this.handleEdit(data)}>
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
                    <IconButton onClick={() => this.handleDelete(data.id)}>
                        <Delete />
                    </IconButton>
                )
            },
        ]

        return (
            <Grid container direction="column">
                <Grid container direction="row" alignItems="center">
                    <SupervisorAccount color="primary" />
                    <Typography>Пользователи</Typography>
                    <Grid item xs />
                    <Search className={classes.searchIcon} />
                    <SearchInput
                        debounce={filter.debounce}
                        search={filter.search}
                        onSearchChange={this.handleSearchChange}
                        onSearch={this.getUsers}
                    />
                    <IconButton onClick={this.handleAdd}>
                        <Add />
                    </IconButton>
                </Grid>
                <Paper className={classes.margin1Y}>
                    <TableComponent columns={columns} data={users} loading={loading} />
                </Paper>
                <ConfirmationDialog
                    open={open}
                    message={'Вы уверены, что хотите удалить пользователя?'}
                    onClose={this.handleConfirmationClose}
                />
            </Grid >
        );
    }
}

export const Users = withStyles(styles)(withRouter(UsersBase));