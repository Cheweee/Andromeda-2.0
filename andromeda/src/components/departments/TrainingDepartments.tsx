import * as React from "react";
import * as Redux from "react-redux";

import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Column } from "../../models/commonModels";
import { TrainingDepartment, AppState, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, AccountBalance, Search, Add, BarChart } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { useDebounce } from "../../hooks";
import { trainingDepartmentActions } from "../../store/trainingDepartmentStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const TrainingDepartments = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { trainingDepartmentState } = Redux.useSelector((state: AppState) => ({ trainingDepartmentState: state.trainingDepartmentState }));

    const [search, setSearch] = React.useState<string>();
    const [open, setOpen] = React.useState<boolean>(false);
    const [id, setId] = React.useState<number>(null);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { getTrainingDepartments(); }, []);
    React.useEffect(() => { getTrainingDepartments(debouncedSearch) }, [debouncedSearch]);

    function getTrainingDepartments(search?: string) {
        dispatch(trainingDepartmentActions.getTrainingDepartments({ search: search, type: DepartmentType.TrainingDepartment }));
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
            await dispatch(trainingDepartmentActions.deleteTrainingDepartments(ids));
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

    let departments: TrainingDepartment[] = [];
    if(trainingDepartmentState.trainingDepartmentsLoading === false) 
        departments = trainingDepartmentState.trainingDepartments;

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
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
                <TableComponent columns={columns} data={departments} loading={trainingDepartmentState.trainingDepartmentsLoading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить кафедру?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));