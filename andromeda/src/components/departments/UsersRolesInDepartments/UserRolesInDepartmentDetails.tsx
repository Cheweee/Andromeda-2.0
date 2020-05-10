import * as React from "react";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { Dialog, DialogTitle, DialogContent, Grid, InputBase, List, ListSubheader, ListItem, ListItemIcon, Checkbox, ListItemText, DialogActions, Button, TextField, CircularProgress } from "@material-ui/core";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Department, RoleInDepartment, UserRoleInDepartment, User, Role } from "../../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    readonly users: User[];
    readonly rolesInDepartment: RoleInDepartment[];
    readonly selectedUser: User;
    readonly selectedRoles: RoleInDepartment[];
    open: boolean;

    onClose: (user: User, rolesInDepartment: RoleInDepartment[]) => void;
    onCancel: () => void;
}

export const UserRolesInDepartmentDetails = withStyles(styles)(function (props: Props) {
    const [user, setUser] = React.useState<User>(User.initial);
    const [roles, setRoles] = React.useState<RoleInDepartment[]>([]);

    React.useEffect(() => { setUser(props.selectedUser); }, [props.selectedUser]);
    React.useEffect(() => { setRoles(props.selectedRoles); }, [props.selectedRoles]);

    function handleUserChange(event: React.ChangeEvent, value: User) {
        setUser(value);
    }

    function handleRoleChange(event: React.ChangeEvent, values: RoleInDepartment[]) {
        setRoles(values);
    }

    const {
        classes,
        users,
        rolesInDepartment,
        open,
        onClose,
        onCancel
    } = props;


    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Выберите сотрудника</DialogTitle>
            <DialogContent>
                <Grid container direction="column" >
                    <Autocomplete
                        className={classes.w100}
                        noOptionsText={"Пользователь не найден"}
                        getOptionLabel={(option: User) => `${option.firstname}${(option.secondname ? (' ' + option.secondname) : '')} ${option.lastname}`}
                        options={users}
                        value={user}
                        onChange={handleUserChange}
                        renderOption={(option: User) => `${option.firstname}${(option.secondname ? (' ' + option.secondname) : '')} ${option.lastname}`}
                        renderInput={params => (
                            <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Сотрудник"
                                placeholder="Сотрудник кафедры"
                                value={user ? `${user.firstname}${(user.secondname ? ' ' + user.secondname : '')} ${user.lastname}` : ''}
                            />
                        )}
                    />
                    <Autocomplete
                        className={classes.w100}
                        multiple
                        options={rolesInDepartment}
                        value={roles}
                        onChange={handleRoleChange}
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
                <Button onClick={onCancel}>
                    Отмена
                    </Button>
                <Button onClick={() => onClose(user, roles)} color="primary" autoFocus>
                    Принять
                    </Button>
            </DialogActions>
        </Dialog>
    )
});