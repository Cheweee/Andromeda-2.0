import * as React from "react";
import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Department, DepartmentValidation, DepartmentType } from "../../models";
import { capitalize } from "../../utilities";
import { useState, useEffect } from "react";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    disabled: boolean;
    department: Department;
    formErrors: DepartmentValidation;
    
    parentDepartment?: Department; 
    parentDepartments?: Department[];

    onDepartmentDetailsChange: (model: Department) => void;
}

export const DepartmentDetails = withStyles(styles)(function (props: Props) {
    const [ selectedParent, setSelectedParent ] = useState<Department>(null);

    useEffect(() => {
        setSelectedParent(props.parentDepartment);
    }, [props.parentDepartment]);

    const {
        classes,
        disabled,
        department,
        formErrors,
        parentDepartments
    } = props;

    let placeholder = "";
    let parentPlaceholder = "";

    const type = department && department.type || DepartmentType.Faculty;

    switch (type) {
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

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onDepartmentDetailsChange } = props;

        const changedDepartment: Department = { ...department, name: event && event.target.value };
        onDepartmentDetailsChange(changedDepartment);
    }

    function handleFullNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onDepartmentDetailsChange } = props;

        const changedDepartment: Department = { ...department, fullName: event && event.target.value };
        onDepartmentDetailsChange(changedDepartment);
    }

    function handleParentChange(event: React.ChangeEvent<HTMLSelectElement>, value: Department) {
        const { onDepartmentDetailsChange } = props;

        const changedDepartment: Department = { ...department, parent: value, parentId: value && value.id };
        onDepartmentDetailsChange(changedDepartment);
    }

    return (
        <Grid container direction="column">
            <Grid container direction="row">
                <Grid item className={classes.margin1X}>
                    <TextField
                        id="name"
                        name="name"
                        label="Сокращение"
                        placeholder={`Введите сокращенное наименование ${placeholder}`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        required
                        disabled={disabled}
                        value={department && department.name || ''}
                        error={Boolean(formErrors.nameError)}
                        helperText={formErrors.nameError}
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs className={classes.margin1X}>
                    <TextField
                        id="fullname"
                        name="fullname"
                        label="наименование"
                        placeholder={`Введите наименование ${placeholder}`}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled={disabled}
                        value={department && department.fullName || ''}
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
                            getOptionSelected={(option: Department, value: Department) => value && option.id === value.id}
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