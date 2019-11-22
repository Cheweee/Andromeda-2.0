import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Department, RoleInDepartment, UserRoleInDepartment, User, Role } from "../../models";
import { Dialog, DialogTitle, DialogContent, Grid, InputBase, List, ListSubheader, ListItem, ListItemIcon, Checkbox, ListItemText, DialogActions, Button, TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { WithStyles, withStyles } from "@material-ui/styles";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly users: User[];
    readonly rolesInDepartment: RoleInDepartment[];
    readonly selectedUser: User;
    readonly selectedRolesInDepartment: RoleInDepartment[];
    open: boolean;

    onClose: (user: User, rolesInDepartment: RoleInDepartment[]) => void;
    onCancel: () => void;
}

interface State {
    selectedUser: User;
    selectedRolesInDepartment: RoleInDepartment[];
    loading: boolean;
}

export const SelectUserRoleInDepartment = withStyles(styles)(class Base extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedUser: null,
            selectedRolesInDepartment: [],
            loading: false
        }
    }

    componentWillUpdate(prevProps: Props, prevState: State) {
        const {
            open,
            selectedUser,
            selectedRolesInDepartment
        } = this.props;

        const user = selectedUser ? { ...selectedUser } : null;

        if (prevProps.open && !open) {
            this.setState({ selectedUser: user, selectedRolesInDepartment: selectedRolesInDepartment.slice() });
        }
        if (!prevProps.open && open) {
            this.setState({ selectedUser: null, selectedRolesInDepartment: [] });
        }
    }

    private handleUserChange = (event: React.ChangeEvent, value: User) => {
        this.setState({ selectedUser: value });
    }

    private handleRoleChange = (event: React.ChangeEvent, values: RoleInDepartment[]) => {
        this.setState({ selectedRolesInDepartment: values });
    }

    render() {
        const {
            classes,
            users,
            rolesInDepartment,
            open,
            onClose,
            onCancel
        } = this.props;
        const {
            selectedUser,
            selectedRolesInDepartment,
            loading
        } = this.state;


        return (
            <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
                <DialogTitle>Выберите сотрудника</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" >
                        <Autocomplete
                            className={classes.w100}
                            noOptionsText={"Пользователь не найден"}
                            getOptionLabel={(option: User) => option.firstname + (option.secondname ? (' ' + option.secondname) : '') + ' ' + option.lastname}
                            options={users}
                            value={selectedUser}
                            onChange={this.handleUserChange}
                            renderOption={(option: User) => `${option.firstname}${(option.secondname ? ' ' + option.secondname : '')} ${option.lastname}`}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    label="Сотрудник"
                                    placeholder="Сотрудник кафедры"
                                    value={selectedUser ? `${selectedUser.firstname}${(selectedUser.secondname ? ' ' + selectedUser.secondname : '')} ${selectedUser.lastname}` : ''}
                                />
                            )}
                        />
                        <Autocomplete
                            className={classes.w100}
                            multiple
                            options={rolesInDepartment}
                            value={selectedRolesInDepartment}
                            onChange={this.handleRoleChange}
                            noOptionsText={"Должность не найдена"}
                            renderOption={(option: RoleInDepartment) => option.roleName}
                            getOptionLabel={(option: RoleInDepartment) => option.roleName}
                            filterSelectedOptions
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    label="Должности"
                                    placeholder="Должности сотрудника"
                                />
                            )}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={() => onClose(selectedUser, selectedRolesInDepartment)} color="primary" autoFocus>
                        Принять
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
});