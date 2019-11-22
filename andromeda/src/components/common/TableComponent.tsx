import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/styles';

import { mergeStyles } from '../../utilities';
import { commonStyles } from '../../muiTheme';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    TablePagination,
} from '@material-ui/core';
import { TableLoader } from '../common/TableLoader';
import { Column } from '../../models/commonModels';

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    columns: Column[];
    data: any[];
    loading: boolean;
}

interface State {
    rowsPerPage: number;
    page: number;
}

class TableComponentBase extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            rowsPerPage: 10,
            page: 0
        };
    }

    private handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    private handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
    };

    private getRow = (data, columns: Column[]) => {
        const { classes } = this.props;
        const rowCells: JSX.Element[] = [];
        for (const column of columns) {
            rowCells.push(
                <TableCell className={classes.td} padding={column.padding} component="td" scope="row">
                    {column.render ? column.render(data) : data[column.name]}
                </TableCell>
            );
        }

        const row = (
            <TableRow>
                {rowCells}
            </TableRow>
        )

        return row;
    }

    render() {
        const {
            loading,
            columns,
            data
        } = this.props;
        const {
            rowsPerPage,
            page,
        } = this.state;

        const rows = data.slice(rowsPerPage * page, rowsPerPage * (page + 1)).map(data => this.getRow(data, columns));

        return (
            <Grid>
                <Table >
                    <TableHead>
                        <TableRow>
                            {columns.map(column => <TableCell padding={column.padding}>{column.displayName}</TableCell>)}
                        </TableRow>
                    </TableHead >
                    <TableBody>
                        {loading && (
                            <TableLoader colSpan={columns.length} />
                        )}
                        {rows}
                    </TableBody>
                </Table >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} из ${count}`}
                    labelRowsPerPage="Строк на странице"
                    backIconButtonProps={{
                        'aria-label': 'Предыдущая страница',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Следующая страница',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Grid>
        );
    }
}

export const TableComponent = withStyles(styles)(TableComponentBase);