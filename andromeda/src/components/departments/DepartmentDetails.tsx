import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Faculty, Department, DepartmentValidation, DepartmentType } from "../../models";
import { capitalize } from "../../utilities";
import { useState, useEffect } from "react";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    department: Department;
    formErrors: DepartmentValidation;
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFullNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleParentChange?: (event: React.ChangeEvent, value: Department) => void;
    parentDepartment?: Department; 
    parentDepartments?: Department[];
}

export const DepartmentDetails = withStyles(styles)(function (props: Props) {
    const [ selectedParent, setSelectedParent ] = useState<Department>(Department.initial);

    useEffect(() => {
        const parent = props.parentDepartment || Department.initial;
        setSelectedParent(parent);
    }, [props.parentDepartment]);

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
                            className={classes.w100}
                            noOptionsText={"Факультет не найден"}
                            getOptionLabel={(option: Department) => option.fullName}
                            options={parentDepartments}
                            value={selectedParent}
                            onChange={handleParentChange}
                            renderOption={(option: Department) => (
                                <Grid container direction="row">
                                    <Grid item className={classes.margin1X} xs={2}>{option.name}</Grid>
                                    <Grid item className={classes.margin1X} xs={9}>{option.fullName}</Grid>
                                </Grid>
                            )}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    disabled={disabled}
                                    label={capitalize(parentPlaceholder)}
                                    placeholder={`Выберите ${parentPlaceholder}`}
                                    value={selectedParent ? selectedParent.name : ''}
                                    error={Boolean(formErrors.parentIdError)}
                                    helperText={formErrors.parentIdError}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
});