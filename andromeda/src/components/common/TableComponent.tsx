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
import { useState } from 'react';

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    columns: Column[];
    data: any[];
    loading: boolean;
}

export const TableComponent = withStyles(styles)(function (props: Props) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    function handleChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) {
        setPage(page);
    };

    function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function getRow(data, columns: Column[]) {
        const { classes } = props;
        const rowCells: JSX.Element[] = [];
        for (const column of columns) {
            rowCells.push(
                <TableCell className={classes.td} padding={column.padding} component="td" scope="row">
                    {column.render ? column.render(data) : data[column.name]}
                </TableCell>
            );
        }

        const row = (<TableRow>{rowCells}</TableRow>);

        return row;
    }

    const { loading, columns, data } = props;

    const rows = data.slice(rowsPerPage * page, rowsPerPage * (page + 1)).map(data => getRow(data, columns));

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
                backIconButtonProps={{ 'aria-label': 'Предыдущая страница' }}
                nextIconButtonProps={{ 'aria-label': 'Следующая страница' }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Grid >
    );
});