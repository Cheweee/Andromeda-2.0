import * as React from "react";
import { WithStyles, withStyles, IconButton, Grid, Typography, Paper } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Filter, Column } from "../../models/commonModels";
import { ApplicationError, Faculty, DepartmentType } from "../../models";
import { paths } from "../../sharedConstants";
import { Edit, Delete, AccountBalance, Search, Add, Apartment } from "@material-ui/icons";
import { SearchInput, TableComponent, ConfirmationDialog } from "../common";
import { departmentService } from "../../services";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

interface State {
    faculties: Faculty[];
    filter?: Filter;
    id?: number;
    loading: boolean;
    open: boolean;
}

class FacultiesBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            faculties: [],
            filter: {
                debounce: 500,
                search: ''
            },
            loading: false,
            open: false
        };
    }

    async componentDidMount() {
        await this.getFaculties();
    }

    private getFaculties = async () => {
        const { filter } = this.state;
        this.setState({ loading: true });
        try {
            const faculties = await departmentService.getFaculties({ 
                search: filter.search,
                type: DepartmentType.Faculty
            });

            this.setState({ faculties });
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
        history.push(paths.getFacultyPath('create'));
    }

    private handleEdit = (model: Faculty) => {
        const {
            history
        } = this.props;
        history.push(paths.getFacultyPath(`${model.id}`));
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
            await this.getFaculties();
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
            faculties
        } = this.state;

        const columns: Column[] = [
            { name: 'name', displayName: 'Сокращение' },
            {
                name: 'edit', padding: "checkbox", displayName: '', render: (data: Faculty) => (
                    <IconButton onClick={() => this.handleEdit(data)}>
                        <Edit />
                    </IconButton>
                )
            },
            { name: 'fullName', displayName: 'Полное наименование' },
            {
                name: 'delete', padding: "checkbox", displayName: '', render: (data: Faculty) => (
                    <IconButton onClick={() => this.handleDelete(data.id)}>
                        <Delete />
                    </IconButton>
                )
            },
        ]

        return (
            <Grid container direction="column">
                <Grid container direction="row" alignItems="center">
                    <Apartment color="primary" />
                    <Typography>Факультеты и институты</Typography>
                    <Grid item xs />
                    <Search className={classes.searchIcon} />
                    <SearchInput
                        debounce={filter.debounce}
                        search={filter.search}
                        onSearchChange={this.handleSearchChange}
                        onSearch={this.getFaculties}
                    />
                    <IconButton onClick={this.handleAdd}>
                        <Add />
                    </IconButton>
                </Grid>
                <Paper className={classes.margin1Y}>
                    <TableComponent columns={columns} data={faculties} loading={loading} />
                </Paper>
                <ConfirmationDialog
                    open={open}
                    message={'Вы уверены, что хотите удалить факультет?'}
                    onClose={this.handleConfirmationClose}
                />
            </Grid >
        );
    }
}

export const Faculties = withStyles(styles)(withRouter(FacultiesBase));