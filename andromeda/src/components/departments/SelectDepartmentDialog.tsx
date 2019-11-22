import * as React from "react";
import { WithStyles, withStyles } from "@material-ui/styles";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    InputBase,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    DialogActions,
    Button,
    ListItemIcon,
    Checkbox
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Department, DepartmentType, RoleInDepartment } from "../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly departments: Department[];
    readonly previousSelected: RoleInDepartment[];
    open: boolean;

    onClose: (selected: RoleInDepartment[]) => void;
}

interface State {
    search: string;
    selected: RoleInDepartment[]
}

class Base extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            search: '',
            selected: []
        }
    }

    componentWillUpdate(prevProps: Props, prevState: State) {
        const {
            open,
            previousSelected
        } = this.props;

        const selected = previousSelected.length ? previousSelected.slice() : [];

        if (prevProps.open && !open) {
            this.setState({
                selected
            })
        }
        if (!prevProps.open && open) {
            this.setState({ selected: [] });
        }
    }

    private handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            search: event.target && event.target.value
        })
    }

    private handleSelect = (department: Department) => {
        const {
            selected
        } = this.state;

        if (selected.find(o => o.departmentId === department.id)) {
            const index = selected.findIndex(o => o.id === department.id);
            selected.splice(index, 1);
        } else {
            selected.push({
                departmentId: department.id,
                departmentName: department.fullName,
                departmentType: department.type
            });
        }

        this.setState({ selected: selected.slice() });
    }

    render() {
        const {
            classes,
            departments,
            previousSelected,
            open,
            onClose
        } = this.props;
        const {
            search,
            selected
        } = this.state;

        const filteredDepartments = departments.filter(o => o.fullName.toLowerCase().includes(search.toLowerCase()));
        const faculties = filteredDepartments.filter(o => o.type === DepartmentType.Faculty);
        const trainingDepartments = filteredDepartments.filter(o => o.type === DepartmentType.TrainingDepartment);
        return (
            <Dialog scroll="paper" open={open} onClose={() => onClose(previousSelected.slice())}>
                <DialogTitle>Выберите подразделения</DialogTitle>
                <DialogContent>
                    <Grid container direction="column">
                        <Grid container direction="row" alignItems="center">
                            <Search className={classes.searchIcon} />
                            <Grid item xs>
                                <InputBase
                                    className={classes.notUnderlined}
                                    value={search}
                                    fullWidth
                                    onChange={this.handleSearch}
                                    placeholder="Поиск"
                                    margin="none"
                                />
                            </Grid>
                        </Grid>
                        <List className={classes.overflowContainery} subheader={<li />}>
                            {faculties.length ?
                                <li key={`section-${DepartmentType.Faculty}`} className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        <ListSubheader>{"Факультеты и институты"}</ListSubheader>
                                        {faculties.map(department =>
                                            <ListItem button onClick={() => this.handleSelect(department)}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={Boolean(selected.find(o => o.departmentId === department.id))}
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
                                                <ListItemText key={department.id} primary={department.fullName} />
                                            </ListItem>
                                        )}
                                    </ul>
                                </li>
                                : null
                            }
                            {trainingDepartments.length ?
                                <div>
                                    <ListSubheader>{"Кафедры"}</ListSubheader>
                                    {trainingDepartments.map(department =>
                                        <ListItem button onClick={() => this.handleSelect(department)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={Boolean(selected.find(o => o.departmentId === department.id))}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText key={department.id} primary={department.fullName} />
                                        </ListItem>
                                    )}
                                </div>
                                : null
                            }
                        </List>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(previousSelected.slice())} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={() => onClose(selected)} color="primary" autoFocus>
                        Принять
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export const SelectDepartmentDialog = withStyles(styles)(Base);