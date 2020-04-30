import * as React from "react";
import * as Redux from "react-redux";

import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Column } from "../../models/commonModels";
import { Faculty, DepartmentType, AppState } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, Search, Add, Apartment } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { useDebounce } from "../../hooks";
import { facultyActions } from "../../store/facultyStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const Faculties = withStyles(styles)(withRouter(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { facultyState } = Redux.useSelector((state: AppState) => ({ facultyState: state.facultyState }));

    const [search, setSearch] = React.useState<string>();
    const [open, setOpen] = React.useState<boolean>(false)
    const [id, setId] = React.useState<number>(null);

    const debouncedSearch = useDebounce(search, 500);

    React.useEffect(() => { getFaculties(); }, []);
    React.useEffect(() => { getFaculties(debouncedSearch) }, [debouncedSearch]);

    async function getFaculties(search?: string) {
        dispatch(facultyActions.getFaculties({ search: search, type: DepartmentType.Faculty   }));
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
            await dispatch(facultyActions.deleteFaculties(ids));
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

    let departments: Faculty[] = [];
    if(facultyState.facultiesLoading === false) 
        departments = facultyState.faculties;

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <Typography>Факультеты и институты</Typography>
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
                <TableComponent columns={columns} data={departments} loading={facultyState.facultiesLoading} />
            </Paper>
            <ConfirmationDialog
                open={open}
                message={'Вы уверены, что хотите удалить факультет?'}
                onClose={handleConfirmationClose}
            />
        </Grid >
    );
}));