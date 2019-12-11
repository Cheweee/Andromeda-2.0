import * as React from "react";
import { useState, useEffect } from "react";

import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Filter, Column, initialFilter } from "../../models/commonModels";
import { ApplicationError, Faculty, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, AccountBalance, Search, Add, Apartment } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { departmentService } from "../../services";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Faculties = withStyles(styles)(withRouter(function (props: Props) {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [filter, setFilter] = useState<Filter>(initialFilter);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false)
    const [id, setId] = useState<number>(null);

    useEffect(() => { getFaculties(); }, [props]);

    async function getFaculties() {
        try {
            setLoading(true);
            const faculties = await departmentService.getFaculties({
                search: filter.search,
                type: DepartmentType.Faculty
            });

            setFaculties(faculties);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
            }
        }
        finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getFacultyPath('create'));
    }

    function handleEdit(model: Faculty) {
        const { history } = props;
        history.push(paths.getFacultyPath(`${model.id}`));
    }

    function handleDelete(id: number) {
        setId(id);
        setOpen(true);
    }

    async function handleConfirmationClose(result: boolean) {
        setOpen(false);
        if (result) {
            const ids = [id];
            await departmentService.delete(ids);
            await getFaculties();
        }
        setId(null);
    }

    async function handleSearchChange(value: string) {
        setFilter({ ...filter, search: value });
    }

    const { classes } = props;

    const columns: Column[] = [
        { name: 'name', displayName: 'Сокращение' },
        {
            name: 'edit', padding: "checkbox", displayName: '', render: (data: Faculty) => (
                <IconButton onClick={() => handleEdit(data)}>
                    <Edit />
                </IconButton>
            )
        },
        { name: 'fullName', displayName: 'Полное наименование' },
        {
            name: 'delete', padding: "checkbox", displayName: '', render: (data: Faculty) => (
                <IconButton onClick={() => handleDelete(data.id)}>
                    <Delete />
                </IconButton>
            )
        },
    ]

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <Apartment color="primary" />
                <Typography>Факультеты и институты</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={handleSearchChange}
                    onSearch={getFaculties}
                />
                <IconButton onClick={handleAdd}>
                    <Add />
                </IconButton>
            </Grid>
            <Paper className={classes.margin1Y}>
                <TableComponent columns={columns} data={faculties} loading={loading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить факультет?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));