import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Faculty, Department, DepartmentValidation, DepartmentType } from "../../models";
import { capitalize } from "../../utilities";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    department: Department;
    formErrors: DepartmentValidation;
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFullNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleParentChange?: (event: React.ChangeEvent, value: Department) => void;
    parentDepartments?: Department[];
}

export const DepartmentDetails = withStyles(styles)(function (props: Props) {
    const {
        classes,
        disabled,
        department,
        formErrors,
        parentDepartments,

        handleNameChange,
        handleParentChange,
        handleFullNameChange
    } = props;

    let placeholder = "";
    let parentPlaceholder = "";

    switch (department.type) {
        case DepartmentType.Faculty: {
            placeholder = "факультета";
            break;
        }
        case DepartmentType.TrainingDepartment: {
            placeholder = "кафедры";
            parentPlaceholder = "факультет";
            break;
        }
        default: {
            placeholder = "департамента";
            break;
        }
    }

    const parentDepartment = department.parent;

    return (
        <Grid container direction="column">
            <Grid container direction="row">
                <Grid item className={classes.margin1X}>
                    <TextField
                        id="name"
                        name="name"
                        label="Сокращение"
                        placeholder={`Введите сокращение наименования ${placeholder}`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        autoComplete="firstname"
                        disabled={disabled}
                        value={department.name}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="fullname"
                        name="fullname"
                        label="Полное наименование"
                        placeholder={`Введите полное наименование ${placeholder}`}
                        margin="normal"
                        variant="outlined"
                        autoComplete="fullname"
                        fullWidth
                        disabled={disabled}
                        value={department.fullName}
                        error={Boolean(formErrors.fullNameError)}
                        helperText={formErrors.fullNameError}
                        onChange={handleFullNameChange}
                    />
                </Grid>
            </Grid>
            {parentDepartments && (
                <Grid container direction="row">
                    <Grid item xs className={classes.margin1X}>
                        <Autocomplete
                            options={parentDepartments}
                            className={classes.w100}
                            noOptionsText={"Факультет не найден"}
                            getOptionLabel={(option: Faculty) => option.fullName}
                            renderOption={(option: Faculty) => (
                                <Grid container direction="row">
                                    <Grid item className={classes.margin1X} xs={2}>{option.name}</Grid>
                                    <Grid item className={classes.margin1X} xs={9}>{option.fullName}</Grid>
                                </Grid>
                            )}
                            value={parentDepartment}
                            onChange={handleParentChange}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    error={Boolean(formErrors.parentIdError)}
                                    helperText={formErrors.parentIdError}
                                    label={capitalize(parentPlaceholder)}
                                    placeholder={`Выберите ${parentPlaceholder}`}
                                    variant="outlined"
                                    fullWidth
                                    disabled={disabled}
                                    value={parentDepartment ? parentDepartment.name : ''}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
});