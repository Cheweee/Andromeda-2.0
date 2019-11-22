import * as React from "react";
import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Filter, Column } from "../../models/commonModels";
import { ApplicationError, TrainingDepartment, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, AccountBalance, Search, Add } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { departmentService } from "../../services";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    departments: TrainingDepartment[];
    filter?: Filter;
    id?: number;
    loading: boolean;
    open: boolean;
}

class TrainingDepartmentsBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            departments: [],
            filter: {
                debounce: 500,
                search: ''
            },
            loading: false,
            open: false
        };
    }

    async componentDidMount() {
        await this.getTrainingDepartments();
    }

    private getTrainingDepartments = async () => {
        const { filter } = this.state;
        this.setState({ loading: true });
        try {
            const departments = await departmentService.getTrainingDepartments({
                search: filter.search,
                type: DepartmentType.TrainingDepartment
            });

            this.setState({ departments });
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
        history.push(paths.getTrainingDepartmentPath('create'));
    }

    private handleEdit = (model: TrainingDepartment) => {
        const {
            history
        } = this.props;
        history.push(paths.getTrainingDepartmentPath(`${model.id}`));
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
            await departmentService.delete(ids);
            await this.getTrainingDepartments();
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
            departments
        } = this.state;

        const columns: Column[] = [
            { name: 'name', displayName: 'Сокращение' },
            {
                name: 'edit', padding: "checkbox", displayName: '', render: (data: TrainingDepartment) => (
                    <IconButton onClick={() => this.handleEdit(data)}>
                        <Edit />
                    </IconButton>
                )
            },
            { name: 'fullName', displayName: 'Полное наименование' },
            { name: `parentName`, displayName: 'Факультет', render: (department) => department.parent && department.parent.name },
            {
                name: 'delete', padding: "checkbox", displayName: '', render: (data: TrainingDepartment) => (
                    <IconButton onClick={() => this.handleDelete(data.id)}>
                        <Delete />
                    </IconButton>
                )
            },
        ]

        return (
            <Grid container direction="column">
                <Grid container direction="row" alignItems="center">
                    <AccountBalance color="primary" />
                    <Typography>Кафедры</Typography>
                    <Grid item xs />
                    <Search className={classes.searchIcon} />
                    <SearchInput
                        debounce={filter.debounce}
                        search={filter.search}
                        onSearchChange={this.handleSearchChange}
                        onSearch={this.getTrainingDepartments}
                    />
                    <IconButton onClick={this.handleAdd}>
                        <Add />
                    </IconButton>
                </Grid>
                <Paper className={classes.margin1Y}>
                    <TableComponent columns={columns} data={departments} loading={loading} />
                </Paper>
                <ConfirmationDialog
                    open={open}
                    message={'Вы уверены, что хотите удалить кафедру?'}
                    onClose={this.handleConfirmationClose}
                />
            </Grid >
        );
    }
}

export const TrainingDepartments = withStyles(styles)(withRouter(TrainingDepartmentsBase));