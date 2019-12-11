import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { Department, RoleInDepartment, UserRoleInDepartment, User, Role } from "../../../models";
import { Dialog, DialogTitle, DialogContent, Grid, InputBase, List, ListSubheader, ListItem, ListItemIcon, Checkbox, ListItemText, DialogActions, Button, TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { WithStyles, withStyles } from "@material-ui/styles";
import { useState, useEffect } from "react";

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
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        const { selectedUser, selectedRoles } = props;

        setSelectedUser(selectedUser);
        setSelectedRoles(selectedRoles);
    }, [props.selectedUser]);

    const handleUserChange = (event: React.ChangeEvent, value: User) => {
        setSelectedUser(value);
    }

    const handleRoleChange = (event: React.ChangeEvent, values: RoleInDepartment[]) => {
        setSelectedRoles(values);
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
                        value={selectedUser}
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
                                value={selectedUser ? `${selectedUser.firstname}${(selectedUser.secondname ? ' ' + selectedUser.secondname : '')} ${selectedUser.lastname}` : ''}
                            />
                        )}
                    />
                    <Autocomplete
                        className={classes.w100}
                        multiple
                        options={rolesInDepartment}
                        value={selectedRoles}
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
                <Button onClick={onCancel} color="primary">
                    Отмена
                    </Button>
                <Button onClick={() => onClose(selectedUser, selectedRoles)} color="primary" autoFocus>
                    Принять
                    </Button>
            </DialogActions>
        </Dialog>
    )
});