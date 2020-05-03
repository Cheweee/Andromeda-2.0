import * as React from "react";

import * as Redux from "react-redux";

import { RouteComponentProps } from "react-router-dom";
import { commonStyles } from "../../../muiTheme";
import { mergeStyles } from "../../../utilities";
import { WithStyles, withStyles, Breadcrumbs, Grid, Link, Typography, Tooltip, IconButton, CardContent, Card, Button } from "@material-ui/core";
import { AppState, DepartmentLoad, TrainingDepartment, StudyLoad, GroupDisciplineLoadValidation, GroupDisciplineLoad, ProjectType, ProjectTypes } from "../../../models";
import { paths } from "../../../sharedConstants";
import { trainingDepartmentActions } from "../../../store/trainingDepartmentStore";
import { Check, Close } from "@material-ui/icons";
import { departmentLoadActions } from "../../../store/departmentLoadStore";

import clsx from "clsx";
import { GroupDisciplineLoadDetails } from "./GroupDisciplineLoadDetails";
import { GroupDisciplineLoadStudyLoad } from "./GroupDisciplineLoadStudyLoad";
import { groupDisciplineLoadActions } from "../../../store/groupDisciplineLoadStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const GroupDisciplineLoadComponent = withStyles(styles)(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const {
        groupDisciplineLoadState,
        departmentLoadState,
        trainingDepartmentState
    } = Redux.useSelector((state: AppState) => ({
        groupDisciplineLoadState: state.groupDisciplineLoadState,
        departmentLoadState: state.departmentLoadState,
        trainingDepartmentState: state.trainingDepartmentState
    }));

    function handleDetailsChange(load: GroupDisciplineLoad) {
        const newLoad = { ...model, ...load };

        dispatch(groupDisciplineLoadActions.updateDetails(newLoad));
    }

    function handleCreateStudyLoad() {
        dispatch(groupDisciplineLoadActions.createStudyLoad());
    }

    function handleProjectTypeChange(index: number, value: ProjectType) {
        const studyLoad = model.studyLoad[index];

        studyLoad.projectType = value;
        dispatch(groupDisciplineLoadActions.updateStudyLoad(index, studyLoad));
    }

    function handleGroupsInStreamChange(index: number, value: string) {
        const studyLoad = model.studyLoad[index];

        const newValue: number = value ? null : parseInt(value);

        studyLoad.shownValue = StudyLoad.updateGroupsInStream(studyLoad.shownValue, newValue);
        studyLoad.value = StudyLoad.computeValue(studyLoad.shownValue);

        dispatch(groupDisciplineLoadActions.updateStudyLoad(index, studyLoad));
    }

    function handleStudyLoadValueChange(index: number, value: string) {
        const studyLoad = model.studyLoad[index];

        const newValue: number = value ? null : parseInt(value);

        if (studyLoad.projectType === ProjectType.lection) {
            studyLoad.shownValue = StudyLoad.updateComputedValue(studyLoad.shownValue, newValue);
            studyLoad.value = StudyLoad.computeValue(studyLoad.shownValue);
        }
        else {
            studyLoad.shownValue = value.toString();
            studyLoad.value = newValue;
        }

        dispatch(groupDisciplineLoadActions.updateStudyLoad(index, studyLoad));
    }

    function handleDeleteStudyLoad(index: number) {
        dispatch(groupDisciplineLoadActions.deleteStudyLoad(index));
    }

    React.useEffect(() => { initialize() }, [props.match]);

    function initialize() {
        const { match } = props;

        const tempDepartmentLoadId = match.params && match.params[paths.departmentLoadIdParameterName];
        const departmentLoadId = parseInt(tempDepartmentLoadId, null);
        const tempDepartmentId = match.params && match.params[paths.departmentIdParameterName];
        const departmentId = parseInt(tempDepartmentId, null);

        dispatch(trainingDepartmentActions.getTrainingDepartment(departmentId));
        if (departmentLoadState.modelLoading === true)
            dispatch(departmentLoadActions.getModel(departmentLoadId));

        const { location } = props;
        const params = new URLSearchParams(location.search);
        const isCreateMode = params.get('mode') === 'create';
        const disciplineTitleId = parseInt(params.get('disc'));
        const studentGroupId = parseInt(params.get('group'));
        const semesterNumber = parseInt(params.get('sem'));
        dispatch(groupDisciplineLoadActions.getModel(
            departmentId,
            departmentLoadId,
            isCreateMode,
            disciplineTitleId,
            studentGroupId,
            semesterNumber
        ));
    }

    function handleCancelClick() {
        initialize();
    }

    function handleSave() {
        dispatch(groupDisciplineLoadActions.save(model));
    }

    //#region Breadcrumbs actions
    function handleToDepartmentsClick() {
        const { history } = props;
        history.push(paths.trainingDepartmentsPath);
    }

    function handleToDepartmentClick() {
        const { history } = props;
        history.push(paths.getTrainingDepartmentPath(props.match.params[paths.departmentIdParameterName]));
    }

    function handleToDepartmentLoadsClick() {
        const { history } = props;
        history.push(paths.getDepartmentloadsPath(props.match.params[paths.departmentIdParameterName]));
    }

    function handleToDepartmentLoadClick() {
        const { history, match } = props;

        const departmentLoadId = match.params && match.params[paths.departmentLoadIdParameterName];
        const departmentId = match.params && match.params[paths.departmentIdParameterName];

        history.push(paths.getDepartmentloadPath(departmentId, departmentLoadId));
    }
    //#endregion

    const { classes } = props;

    let department: TrainingDepartment = null;
    if (trainingDepartmentState.trainingDepartmentLoading === false) {
        department = trainingDepartmentState.trainingDepartment;
    }

    let departmentLoad: DepartmentLoad = null;
    if (departmentLoadState.modelLoading === false) {
        departmentLoad = departmentLoadState.model;
    }

    let model: GroupDisciplineLoad = null;
    if (groupDisciplineLoadState.modelLoading === false)
        model = groupDisciplineLoadState.model;

    const disabled = trainingDepartmentState.trainingDepartmentLoading || departmentLoadState.modelLoading;
    const studyLoad = model ? model.studyLoad : [];
    const projectTypes = ProjectTypes.filter(o => !studyLoad.map(o => o.projectType).includes(o));

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row" alignItems="center">
                        <Breadcrumbs>
                            <Link color="inherit" onClick={handleToDepartmentsClick}>Кафедры</Link>
                            <Link color="inherit" onClick={handleToDepartmentClick}>{department && department.name || ''}</Link>
                            <Link color="inherit" onClick={handleToDepartmentLoadsClick}>Нагрузка кафедры</Link>
                            <Link color="inherit" onClick={handleToDepartmentLoadClick}>{departmentLoad && departmentLoad.studyYear || DepartmentLoad.currentStudyYear}</Link>
                            <Typography color="textPrimary">Учебная нагрузка</Typography>
                        </Breadcrumbs>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={disabled} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить нагрузку кафедры">
                            <span>
                                <IconButton color="primary" disabled={disabled} onClick={handleSave}>
                                    <Check />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <GroupDisciplineLoadDetails
                                disciplinesTitles={department && department.titles || []}
                                studentGroups={department && department.groups || []}
                                formErrors={groupDisciplineLoadState.formErrors}
                                groupDisciplineLoad={model}
                                onDetailsChange={handleDetailsChange}
                            />
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography>Планируемые работы</Typography>
                        <Grid item xs />
                        <Button onClick={handleCreateStudyLoad}><Typography color="textSecondary">Добавить</Typography></Button>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <GroupDisciplineLoadStudyLoad
                                    projectTypes={projectTypes}
                                    studyLoad={studyLoad}
                                    onDeleteStudyLoad={handleDeleteStudyLoad}
                                    onGroupsInStreamChange={handleGroupsInStreamChange}
                                    onProjectTypeChange={handleProjectTypeChange}
                                    onValueChange={handleStudyLoadValueChange}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} />
            </Grid >
        </form>
    );
})