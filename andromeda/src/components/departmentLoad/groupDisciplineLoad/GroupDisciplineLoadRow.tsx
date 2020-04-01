import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { WithStyles, Grid, ListItem, Collapse, Typography, IconButton, Divider, Tooltip, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { GroupDisciplineLoad, ProjectType } from "../../../models";
import { withStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore, AssignmentInd, Edit, Delete } from "@material-ui/icons";
import { departmentLoadService } from "../../../services/departmentLoadService";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    groupDisciplineLoad: GroupDisciplineLoad;
    open: boolean;
    index: number;
    onEditClick: (indeex: number) => void;
    onDeleteClick: (index: number) => void;
    onDetailsOpen: (index: number) => void;
    onDistributeLoadClick: (index: number) => void;
}

export const GroupDisciplineLoadDetailsRow = withStyles(styles)(function (props: Props) {

    const {
        classes,
        index,
        groupDisciplineLoad,
        open,
        onEditClick,
        onDetailsOpen,
        onDistributeLoadClick,
        onDeleteClick
    } = props;

    function toggle(event: React.MouseEvent<Element, MouseEvent>, index: number) {
        event.preventDefault();
        if (studyLoadComponent !== null)
            onDetailsOpen(index);
    }
    const studyLoads = groupDisciplineLoad.studyLoad || [];
    let studyLoadComponent = null;
    if (departmentLoadService.isStudyLoadForGroup(studyLoads)) {
        studyLoadComponent = (
            <Table>
                <TableHead>
                    <TableRow>
                        {studyLoads.map((o, index) => {
                            return <TableCell key={index} align="right">{ProjectType.getProjectTypeDescription(o.projectType)}</TableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {studyLoads.map((o, index) => {
                            return <TableCell key={index} align="right">{`${o.shownValue} ч.`}</TableCell>
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    return (
        <Grid key={index}>
            <ListItem key={index}>
                <Grid item xs="auto">
                    {studyLoadComponent !== null ?
                        <IconButton onClick={(event: React.MouseEvent) => toggle(event, index)}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        : null
                    }
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <Typography>{groupDisciplineLoad.disciplineTitle.name}</Typography>
                </Grid>
                <Grid item xs="auto">
                    <Tooltip title="Редактировать нагрузку">
                        <IconButton onClick={() => onEditClick(index)}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} className={classes.margin1X}>
                    <Typography>{`${groupDisciplineLoad.semesterNumber} сем.`}</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>{`${groupDisciplineLoad.studentGroup.name} (${groupDisciplineLoad.studentGroup.studentsCount} ст.)`}</Typography>
                </Grid>
                <Grid item xs="auto">
                    <Typography>{`Всего: ${groupDisciplineLoad.amount.toFixed(2)} ч.`}</Typography>
                </Grid>
                <Grid item xs="auto">
                    <Tooltip title="Распределить нагрузку">
                        <IconButton onClick={() => onDistributeLoadClick(index)}>
                            <AssignmentInd />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs="auto">
                    <Tooltip title="Удалить нагрузку">
                        <IconButton onClick={() => onDeleteClick(index)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Divider />
                {studyLoadComponent}
            </Collapse>
            <Divider />
        </Grid>
    );
});