import * as React from "react";
import * as Redux from 'react-redux';

import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Column } from "../../models/commonModels";
import { Role, AppState } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, Search, Add, AssignmentInd } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { useDebounce } from "../../hooks";
import { roleActions } from "../../store/roleStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Roles = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { roleState } = Redux.useSelector((state: AppState) => ({ roleState: state.roleState }));

    const [search, setSearch] = React.useState<string>();
    const [id, setId] = React.useState<number>(null);
    const [open, setOpen] = React.useState<boolean>(false);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { getRoles(); }, []);
    React.useEffect(() => { getRoles(debouncedSearch) }, [debouncedSearch]);

    function getRoles(search?: string) {
        dispatch(roleActions.getRoles({ search: search }));
    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getRolePath('create'));
    }

    function handleEdit(model: Role) {
        const { history } = props;
        history.push(paths.getRolePath(`${model.id}`));
    }

    function handleDelete(id: number) {
        setId(id);
        setOpen(true);
    }

    async function handleConfirmationClose(result: boolean) {
        setOpen(false);
        if (result) {
            const ids = [id];
            await dispatch(roleActions.deleteRoles(ids));
        }
        setId(null);
    }

    async function handleSearchChange(value: string) {
        setSearch(value);
    }

    const { classes } = props;
    const columns: Column[] = [
        { name: 'name', displayName: 'Сокращение' },
        {
            name: 'edit', padding: "checkbox", displayName: '', render: (data: Role) => (
                <IconButton onClick={() => handleEdit(data)}>
                    <Edit />
                </IconButton>
            )
        },
        {
            name: 'delete', padding: "checkbox", displayName: '', render: (data: Role) => (
                <IconButton onClick={() => handleDelete(data.id)}>
                    <Delete />
                </IconButton>
            )
        },
    ]

    let roles: Role[] = [];
    if(roleState.loading === false) {
        roles = roleState.roles;
    }

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <AssignmentInd color="primary" />
                <Typography>Роли и должности</Typography>
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
                <TableComponent columns={columns} data={roles} loading={roleState.loading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить роль?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));