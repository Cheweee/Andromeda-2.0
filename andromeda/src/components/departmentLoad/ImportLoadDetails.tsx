import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { AttachFile } from "@material-ui/icons";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    InputAdornment,
    DialogActions,
    Button,
    FormControl,
    OutlinedInput,
    IconButton,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormHelperText
} from "@material-ui/core";

import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import {
    DepartmentLoadImportOptions,
    DepartmentLoadImportOptionsValidation
} from "../../models";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    onAccept: (options: DepartmentLoadImportOptions) => void;
    onCancel: () => void;
}


export const ImportLoadDetails = withStyles(styles)(function (props: Props) {
    const [options, setOptions] = useState<DepartmentLoadImportOptions>(DepartmentLoadImportOptions.initial);
    const [formErrors, setFormErrors] = useState<DepartmentLoadImportOptionsValidation>(DepartmentLoadImportOptionsValidation.initial);
    const [loading, setLoading] = useState<boolean>(false);

    const uploader = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fileName = options.file && options.file.name;
        setOptions({ ...options, fileName });
    }, [options.file])

    useEffect(() => {
        const fileError = options.fileName ? null : 'Для импорта необходимо выбрать файл Excel с нагрузкой кафедры.';
        const isValid = !fileError;

        setFormErrors({
            fileError,
            isValid
        })
    }, [options])

    function handleAccept() {
        const { onAccept } = props;
        onAccept(options);
        setOptions(DepartmentLoadImportOptions.initial);
    }

    function handleFileLoad() {
        uploader.current.click();
    };

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            event.preventDefault();
            if (event.target.files.length === 0) return;

            setLoading(true);

            const file = event.target.files[0];
            event.target.value = null;

            setOptions({ ...options, file });
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    }

    const {
        open,
        onCancel,
        classes
    } = props;
    return (
        <Dialog fullWidth maxWidth="sm" scroll="paper" open={open} onClose={onCancel}>
            <DialogTitle>Импорт учебной нагрузки</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <FormControl fullWidth variant="outlined">
                        <OutlinedInput
                            id="file"
                            value={options.fileName}
                            placeholder="Excel файл нагрузки"
                            readOnly={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <div className={classes.wrapper}>
                                        <IconButton
                                            aria-label="load file"
                                            onClick={handleFileLoad}
                                            edge="end"
                                        >
                                            <AttachFile />
                                        </IconButton>
                                        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                                    </div>
                                </InputAdornment>
                            }
                            labelWidth={0}
                            error={Boolean(formErrors.fileError)}
                        />
                        <FormHelperText error={Boolean(formErrors.fileError)}>{formErrors.fileError}</FormHelperText>
                        <input
                            type="file"
                            ref={uploader}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept=".xlsx, .xls, .csv"
                        />
                    </FormControl>
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.updateDisciplinesTitles}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOptions({ ...options, updateDisciplinesTitles: event.target && event.target.checked })}
                                value="Update Disciplines titles"
                            />
                        }
                        label="Обновить наименование дисциплин кафедры?"
                    />
                    <FormControlLabel
                        className={classes.margin1Top}
                        control={
                            <Checkbox
                                checked={options.updateStudentsGroups}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOptions({ ...options, updateStudentsGroups: event.target && event.target.checked })}
                                value="Update student groups"
                            />
                        }
                        label="Обновить учебные группы кафедры?"
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Отмена
                    </Button>
                <Button disabled={!formErrors.isValid} onClick={handleAccept} color="primary" autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    );
});