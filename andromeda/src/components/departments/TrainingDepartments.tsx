import * as React from "react";
import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Column } from "../../models/commonModels";
import { TrainingDepartment, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, AccountBalance, Search, Add, BarChart } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { departmentService } from "../../services";
import useDebounce from "../../hooks/debounceHook";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const TrainingDepartments = withStyles(styles)(withRouter(function (props: Props) {
    const [departments, setDepartments] = React.useState<TrainingDepartment[]>([]);
    const [search, setSearch] = React.useState<string>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);
    const [id, setId] = React.useState<number>(null);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { getTrainingDepartments(); }, []);
    React.useEffect(() => { getTrainingDepartments(debouncedSearch) }, [debouncedSearch]);

    async function getTrainingDepartments(search?: string) {
        setLoading(true);
        const departments = await departmentService.getTrainingDepartments({
            search: search,
            type: DepartmentType.TrainingDepartment
        });

        setDepartments(departments);
        setLoading(false);
    }

    function handleAdd() {
        const { history } = props;
        history.push(paths.getTrainingDepartmentPath('create'));
    }

    function handleEdit(model: TrainingDepartment) {
        const { history } = props;
        history.push(paths.getTrainingDepartmentPath(`${model.id}`));
    }

    function handleDepartmentLoad(model: TrainingDepartment) {
        const { history } = props;
        history.push(paths.getDepartmentloadsPath(`${model.id}`));
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
            //setSnackbar("Кафедра успешно удалена.", true, SnackbarVariant.success);
            await getTrainingDepartments();
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
            name: 'edit', padding: "checkbox", displayName: '', render: (data: TrainingDepartment) => (
                <IconButton onClick={() => handleEdit(data)}>
                    <Edit />
                </IconButton>
            )
        },
        {
            name: 'studyload', padding: "checkbox", displayName: '', render: (data: TrainingDepartment) => (
                <IconButton onClick={() => handleDepartmentLoad(data)}>
                    <BarChart />
                </IconButton>
            )
        },
        { name: 'fullName', displayName: 'Полное наименование' },
        { name: `parentName`, displayName: 'Факультет', render: (department) => department.parent && department.parent.name },
        {
            name: 'delete', padding: "checkbox", displayName: '', render: (data: TrainingDepartment) => (
                <IconButton onClick={() => handleDelete(data.id)}>
                    <Delete />
                </IconButton>
            )
        },
    ]

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <AccountBalance color="primary" />
                <Typography>Кафедры</Typography>
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
                <TableComponent columns={columns} data={departments} loading={loading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить кафедру?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));