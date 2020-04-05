import * as React from "react";
import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { IFilter, Column, SnackbarVariant, Filter } from "../../models/commonModels";
import { ApplicationError, Role, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, Search, Add, Apartment, AssignmentInd } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog, MessageSnackbar } from "../common";
import { roleService } from "../../services";
import useDebounce from "../../hooks/debounceHook";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Roles = withStyles(styles)(withRouter(function (props: Props) {
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [search, setSearch] = React.useState<string>();
    const [id, setId] = React.useState<number>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { getRoles(); }, []);
    React.useEffect(() => { getRoles(debouncedSearch) }, [debouncedSearch]);

    async function getRoles(search?: string) {
        setLoading(true);
        const roles = await roleService.getRoles({ search: search });

        setRoles(roles);
        setLoading(false);
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
        try {
            setOpen(false);
            if (result) {
                const ids = [id];
                await roleService.delete(ids);
                //setSnackbar('Роль успешно удалена', false, undefined);
                await getRoles();
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                //setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setId(null);
        }
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
                <TableComponent columns={columns} data={roles} loading={loading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить роль?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));