import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle, DialogContent, Grid, InputBase, List, ListSubheader, ListItem, ListItemText, DialogActions, Button, ListItemIcon, Checkbox, FormControlLabel, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Divider } from "@material-ui/core";
import { Search, ExpandMore } from "@material-ui/icons";
import { mergeStyles } from "../../../utilities";
import { commonStyles, expansionPanelStyles } from "../../../muiTheme";
import { Department, RoleInDepartment, DepartmentType } from "../../../models";

const styles = mergeStyles(commonStyles, expansionPanelStyles);

interface Props extends WithStyles<typeof styles> {
    readonly departments: Department[];
    readonly previousSelected: RoleInDepartment[];
    open: boolean;

    onClose: (selected: RoleInDepartment[]) => void;
}


export const RoleDepartmentsDetails = withStyles(styles)(function (props: Props) {
    const [search, setSearch] = React.useState<string>('');
    const [selected, setSelected] = React.useState<RoleInDepartment[]>([]);

    React.useEffect(() => {
        if (props.open) {
            const selected = previousSelected.length ? previousSelected.slice() : [];
            setSelected(selected);
        }
        else {
            setSelected([]);
        }
    }, [props.open]);

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.target && event.target.value);
    }

    function handleSelect(department: Department) {
        const checked = Boolean(selected.find(o => o.departmentId === department.id));
        const roleDepartments = selected.filter(o => o.departmentId !== department.id);
        if (!checked) {
            roleDepartments.push({
                departmentId: department.id,
                departmentName: department.fullName,
                departmentType: department.type
            });
        }

        setSelected([...roleDepartments]);
    }

    function handleAllFacultiesSelect(event: React.ChangeEvent<HTMLInputElement>, value: boolean) {
        let departments = selected.filter(o => o.departmentType !== DepartmentType.Faculty);

        if (value) {
            for (let department of faculties) {
                departments.push({
                    departmentId: department.id,
                    departmentName: department.fullName,
                    departmentType: DepartmentType.Faculty,
                });
            }
        }
        setSelected([...departments]);
    }

    function handleAllTrainingDepartmentsSelect(event: React.ChangeEvent<HTMLInputElement>, value: boolean) {
        let departments = selected.filter(o => o.departmentType !== DepartmentType.TrainingDepartment);

        if (value) {
            for (let department of trainingDepartments) {
                departments.push({
                    departmentId: department.id,
                    departmentName: department.fullName,
                    departmentType: DepartmentType.TrainingDepartment,
                });
            }
        }
        setSelected([...departments]);
    }

    const {
        classes,
        departments,
        previousSelected,
        open,
        onClose
    } = props;

    const filteredDepartments = departments.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.fullName.toLowerCase().includes(search.toLowerCase()));
    const faculties = filteredDepartments.filter(o => o.type === DepartmentType.Faculty);
    const trainingDepartments = filteredDepartments.filter(o => o.type === DepartmentType.TrainingDepartment);
    const allFacultiesSelected = faculties.every(o => selected.map(s => s.departmentId).includes(o.id));
    const allTrainingDepartmentsSelected = trainingDepartments.every(o => selected.map(s => s.departmentId).includes(o.id));
    return (
        <Dialog scroll="paper" maxWidth="md" open={open} onClose={() => onClose(previousSelected.slice())}>
            <DialogTitle>
                <Grid container direction="row" alignItems="center">
                    <Typography>Выберите подразделения</Typography>
                    <Grid item xs />
                    <Search className={classes.searchIcon} />
                    <Grid item>
                        <InputBase
                            className={classes.notUnderlined}
                            value={search}
                            fullWidth
                            onChange={handleSearch}
                            placeholder="Поиск"
                            margin="none"
                        />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {Boolean(faculties.length) && (
                    <ExpansionPanel square classes={{ root: classes.panelRoot }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            classes={{ root: classes.summaryRoot, content: classes.summaryContent }}
                        >
                            <FormControlLabel
                                onClick={(event) => event.stopPropagation()}
                                control={<Checkbox checked={allFacultiesSelected} color="primary" onChange={handleAllFacultiesSelect} />}
                                label="Факультеты и институты"
                            />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
                            <List className={classes.w100}>
                                {faculties.map((department, index) =>
                                    <ListItem key={index} button onClick={() => handleSelect(department)}>
                                        <Grid container direction="row" alignItems="center">
                                            <Checkbox
                                                edge="start"
                                                checked={Boolean(selected.find(o => o.departmentId === department.id))}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                            <Typography>{department.fullName}</Typography>
                                        </Grid>
                                    </ListItem>
                                )}
                            </List>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}
                <Divider />
                {Boolean(trainingDepartments.length) && (
                    <ExpansionPanel square classes={{ root: classes.panelRoot }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            classes={{ root: classes.summaryRoot, content: classes.summaryContent }}
                        >
                            <FormControlLabel
                                onClick={(event) => event.stopPropagation()}
                                control={<Checkbox checked={allTrainingDepartmentsSelected} onChange={handleAllTrainingDepartmentsSelect} color="primary" />}
                                label="Кафедры"
                            />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
                            <List className={classes.w100}>
                                {trainingDepartments.map((department, index) =>
                                    <ListItem key={index} button onClick={() => handleSelect(department)}>
                                        <Grid container direction="row" alignItems="center">
                                            <Checkbox
                                                edge="start"
                                                checked={Boolean(selected.find(o => o.departmentId === department.id))}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                            <Typography>{department.fullName}</Typography>
                                        </Grid>
                                    </ListItem>
                                )}
                            </List>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(previousSelected.slice())}>
                    Отмена
                    </Button>
                <Button onClick={() => onClose(selected)} color="primary" autoFocus>
                    Принять
                    </Button>
            </DialogActions>
        </Dialog >
    );
});