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
import { useState, useEffect } from "react";
import { useFilterState } from "../../hooks";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Roles = withStyles(styles)(withRouter(function (props: Props) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [filter, setFilter] = useFilterState(Filter.initial);
    const [id, setId] = useState<number>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => { getRoles(); }, [props]);

    async function getRoles() {
        try {
            setLoading(true);
            const roles = await roleService.getRoles({ search: filter.search });

            setRoles(roles);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                //setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally { setLoading(false); }
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
        setFilter(value);
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
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={handleSearchChange}
                    onSearch={getRoles}
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