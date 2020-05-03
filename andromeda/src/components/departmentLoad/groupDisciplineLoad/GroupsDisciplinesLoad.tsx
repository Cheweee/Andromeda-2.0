import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { GroupDisciplineLoad } from "../../../models";
import { List, Grid, ListItem, ListItemIcon, ListItemText, Collapse, TablePagination, Typography } from "@material-ui/core";
import { useState } from "react";
import { Inbox, ExpandLess, ExpandMore } from "@material-ui/icons";
import { GroupDisciplineLoadDetailsRow } from "./GroupDisciplineLoadRow";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    search: string;
    openedIndex: number;
    groupsDisciplinesLoad: GroupDisciplineLoad[];
    onEditClick: (index: number) => void;
    onDeleteClick: (index: number) => void;
    onDetailsOpen: (index: number) => void;
    onDistributeClick: (index: number) => void;
}

export const GroupsDisciplinesLoad = withStyles(styles)(function (props: Props) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    function handleChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) {
        setPage(page);
    };

    function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const {
        openedIndex,
        groupsDisciplinesLoad,
        onEditClick,
        onDeleteClick,
        onDetailsOpen,
        onDistributeClick,
        search,

        classes
    } = props;

    const rows = groupsDisciplinesLoad
        .filter(o => o.disciplineTitle.name.toLowerCase().includes(search.toLowerCase()) || o.studentGroup.name.includes(search.toLowerCase()))
        .slice(rowsPerPage * page, rowsPerPage * (page + 1));

    if (!groupsDisciplinesLoad.length) {
        return (
            <Grid className={classes.padding1} container direction="row" justify="center" alignItems="center">
                <Typography color="textSecondary">Нагрузка еще не запланирована</Typography>
            </Grid>
        );
    }

    return (
        <Grid>
            <List>
                {rows.map(o => {
                    let index = groupsDisciplinesLoad.indexOf(o);
                    const open = openedIndex === index;
                    return (
                        <GroupDisciplineLoadDetailsRow
                            key={index}
                            groupDisciplineLoad={o}
                            open={open}
                            index={index}
                            onEditClick={onEditClick}
                            onDeleteClick={onDeleteClick}
                            onDetailsOpen={onDetailsOpen}
                            onDistributeLoadClick={onDistributeClick}
                        />
                    );
                })
                }
            </List>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={groupsDisciplinesLoad.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to} из ${count}`}
                labelRowsPerPage="Строк на странице"
                backIconButtonProps={{ 'aria-label': 'Предыдущая страница' }}
                nextIconButtonProps={{ 'aria-label': 'Следующая страница' }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Grid>
    );
});