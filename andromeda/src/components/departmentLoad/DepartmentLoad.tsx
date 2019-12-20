import * as React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WithStyles, withStyles } from "@material-ui/styles";
import { commonStyles } from "../../muiTheme";
import { mergeStyles } from "../../utilities";
import { DepartmentLoad, ApplicationError, SnackbarVariant, Filter, StudyLoad, User, ProjectType, DistributionData } from "../../models";
import { paths } from "../../sharedConstants";
import { useSnackbarState } from "../../hooks";
import { Grid, Card, CardHeader, CardContent, Typography, Tooltip, Fab, CircularProgress } from "@material-ui/core";
import { departmentLoadService } from "../../services/departmentLoadService";
import { MessageSnackbar, PercentageCircularProgress, SearchInput } from "../common";
import { DepartmentLoadDetails } from "./DepartmentLoadDetails";
import { Search, PieChartRounded, PieChartSharp, Add, Save, Check } from "@material-ui/icons";
import { useFilterState } from "../../hooks/filterStateHook";
import clsx from "clsx";
import { StudyLoadCard, StudyLoadChart } from "./studyLoad";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

const initialDepartmentLoad: DepartmentLoad = {
    studyYears: currentYear + ' - ' + nextYear,
    totalLoad: 0
};

export const DepartmentLoadComponent = withStyles(styles)(function (props: Props) {
    //#region Department load state
    const [departmentLoad, setDepartmentLoad] = useState<DepartmentLoad>(initialDepartmentLoad);

    async function getDepartmentLoad() {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        let departmentLoad: DepartmentLoad = initialDepartmentLoad;
        try {
            setLoading(true);
            const id = parseInt(tempId, 0);
            if (id) {
                const loads = departmentLoadService.getDepartmentLoads({ id });
                departmentLoad = loads[0];
            }

            setDepartmentLoad(departmentLoad);
            setLoading(false);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
        }
    }

    function handleDistributeStudyLoad() {
        // const id = Math.max(...(data.map(o => o.id)), 0) + 1;

        // const newDistributionData: DistributionBarChartData = {
        //     id: id,
        //     lecturer: "Новый преподаватель",
        //     total: 0
        // };
        // data.push(newDistributionData);
        // const newData = data.slice();

        // setData(newData);
    }

    function handleSaveStudyLoad() {
        const timer = setTimeout(() => {
            setSaving(false);
            setSnackbar('Учебная нагрузка кафедры успешно сохранена', true, SnackbarVariant.success);

            clearTimeout(timer);
        }, 2500);
        setSaving(true);
    }

    async function handleGenerateStudyLoad() {
        try {
            setGenerating(false);

            const load = await departmentLoadService.generate(departmentLoad);

            setDepartmentLoad(load);
        }
        catch(error) {
            if(error instanceof ApplicationError) {
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setGenerating(true);
        }
    }

    function handleDelete(id: number) {
        // const newData = data.filter(o => o.id !== id);

        // setData(newData);
    }
    //#endregion

    //#region Filter state
    const [filter, setFilter] = useFilterState(Filter.initialFilter);

    async function handleSearchChange(value: string) {
        setFilter(value);
    }
    //#endregion

    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    const [snackbar, setSnackbar] = useSnackbarState();

    useEffect(() => { getDepartmentLoad(); }, [props.match.params]);

    const { classes } = props;

    const studyLoad = departmentLoad.studyLoad || [];

    const lecturerDictionary: [User, StudyLoad[]][] = [];
    for (const load of studyLoad) {
        let item: [User, StudyLoad[]] = lecturerDictionary.find(o => o[0].id === load.userId);
        if (!item) {
            const loads = [load];
            item = [load.user, loads];
            lecturerDictionary.push(item);
        } else {
            item[1].push(load);
        }
    }

    const barData: DistributionData[] = lecturerDictionary.map(
        (dictItem: [User, StudyLoad[]], index: number) => {
            const lecturer = dictItem[0];
            const load = dictItem[1];
            const total = load.map(o => o.value).reduce((sum, current) => sum + current, 0);

            const lections = load.filter(o => o.projectType == ProjectType.lection).map(o => o.value).reduce((sum, current) => sum + current, null);
            const practicalLessons = load.filter(o => o.projectType == ProjectType.practicalLesson).map(o => o.value).reduce((sum, current) => sum + current, null);
            const laboratoryLessons = load.filter(o => o.projectType == ProjectType.laboratoryLesson).map(o => o.value).reduce((sum, current) => sum + current, null);
            const thematicalDiscussions = load.filter(o => o.projectType == ProjectType.thematicalDiscussion).map(o => o.value).reduce((sum, current) => sum + current, null);
            const consultations = load.filter(o => o.projectType == ProjectType.consultation).map(o => o.value).reduce((sum, current) => sum + current, null);
            const exams = load.filter(o => o.projectType == ProjectType.exam).map(o => o.value).reduce((sum, current) => sum + current, null);
            const offsets = load.filter(o => o.projectType == ProjectType.offset).map(o => o.value).reduce((sum, current) => sum + current, null);
            const abstracts = load.filter(o => o.projectType == ProjectType.abstract).map(o => o.value).reduce((sum, current) => sum + current, null);
            const stateExams = load.filter(o => o.projectType == ProjectType.stateExam).map(o => o.value).reduce((sum, current) => sum + current, null);
            const postgraduateEntranceExams = load.filter(o => o.projectType == ProjectType.postgraduateEntranceExam).map(o => o.value).reduce((sum, current) => sum + current, null);
            const practices = load.filter(o => o.projectType == ProjectType.practice).map(o => o.value).reduce((sum, current) => sum + current, null);
            const departmentManagements = load.filter(o => o.projectType == ProjectType.departmentManagement).map(o => o.value).reduce((sum, current) => sum + current, null);
            const studentResearchWorks = load.filter(o => o.projectType == ProjectType.studentResearchWork).map(o => o.value).reduce((sum, current) => sum + current, null);
            const courseWorks = load.filter(o => o.projectType == ProjectType.courseWork).map(o => o.value).reduce((sum, current) => sum + current, null);
            const graduationQualificationManagements = load.filter(o => o.projectType == ProjectType.graduationQualificationManagement).map(o => o.value).reduce((sum, current) => sum + current, null);
            const masterProgramManagements = load.filter(o => o.projectType == ProjectType.masterProgramManagement).map(o => o.value).reduce((sum, current) => sum + current, null);
            const postgraduateProgramManagements = load.filter(o => o.projectType == ProjectType.postgraduateProgramManagement).map(o => o.value).reduce((sum, current) => sum + current, null);
            const others = load.filter(o => o.projectType == ProjectType.other).map(o => o.value).reduce((sum, current) => sum + current, null);

            const data: DistributionData = {
                id: index,
                lecturer: lecturer,
                total: total,
                lections: lections,
                practicalLessons: practicalLessons,
                laboratoryLessons: laboratoryLessons,
                thematicalDiscussions: thematicalDiscussions,
                consultations: consultations,
                exams: exams,
                offsets: offsets,
                abstracts: abstracts,
                stateExams: stateExams,
                postgraduateEntranceExams: postgraduateEntranceExams,
                practices: practices,
                departmentManagements: departmentManagements,
                studentResearchWorks: studentResearchWorks,
                courseWorks: courseWorks,
                graduationQualificationManagements: graduationQualificationManagements,
                masterProgramManagements: masterProgramManagements,
                postgraduateProgramManagements: postgraduateProgramManagements,
                others: others
            };
            return data;
        }
    );

    const allocatedStudyLoad = studyLoad.map(o => o.value).reduce((sum, current) => sum + current, 0);
    const unallocatedStudyLoad = departmentLoad.totalLoad - allocatedStudyLoad;
    const percentage = (100 * allocatedStudyLoad / departmentLoad.totalLoad) | 0;

    return (
        <Grid container direction="column">
            <Grid container direction="column">
                <Grid container direction="row" alignItems="center">
                    <Grid item>
                        <Card className={classes.fixedHeight300}>
                            <CardHeader title="Нагрузка кафедры" />
                            <CardContent>
                                <DepartmentLoadDetails departmentLoad={departmentLoad} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card className={classes.fixedHeight300}>
                            <CardHeader title="Прогресс" />
                            <CardContent>
                                <Grid container direction="column" alignItems="center" justify="space-between">
                                    <PercentageCircularProgress size={140} variant="static" value={percentage} />
                                    <Typography variant="h6">Осталось: {unallocatedStudyLoad}ч.</Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container direction="row">
                    <Card className={classes.fixedHeight300}>
                        <CardHeader title="Нагрузка преподавателей" />
                        <CardContent>
                            <StudyLoadChart chartData={barData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid className={classes.margin2Top} container direction="row">
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                        <Search className={classes.searchIcon} />
                        <SearchInput
                            onSearch={getDepartmentLoad}
                            onSearchChange={handleSearchChange}
                            debounce={filter.debounce}
                            search={filter.search}
                        />
                    </Grid>
                    {barData && barData.map(o =>
                        <Grid item xs={4}>
                            <StudyLoadCard
                                onDelete={handleDelete}
                                data={o}
                            />
                        </Grid>
                    )}
                </Grid>
                <div className={classes.footerSpacer}></div>
            </Grid>
            <footer className={classes.footer}>
                <Grid className={clsx(classes.footerContainer, classes.padding1)} container direction="row" alignItems="center">
                    <Typography variant="h6">Всего нагрузки: {studyLoad}ч. Распределено: {allocatedStudyLoad}ч.</Typography>
                    <Grid item xs />
                    <Tooltip title="Автоматическое распределение нагрузки">
                        <div className={classes.wrapper}>
                            <Fab color="primary" onClick={handleGenerateStudyLoad}>
                                {generating ? <PieChartRounded /> : <PieChartSharp />}
                            </Fab>
                            {generating && <CircularProgress size={68} className={classes.fabProgress} />}
                        </div>
                    </Tooltip>
                    {unallocatedStudyLoad ?
                        <Tooltip title="Распределить нагрузку">
                            <div className={classes.wrapper}>
                                <Fab
                                    color="primary"
                                    onClick={handleDistributeStudyLoad}
                                >
                                    <Add />
                                </Fab>
                            </div>
                        </Tooltip>
                        :
                        <Tooltip title="Сохранить распределение">
                            <div className={classes.wrapper}>
                                <Fab
                                    color="primary"
                                    className={clsx(!unallocatedStudyLoad && !saving && classes.buttonSuccess)}
                                    onClick={handleSaveStudyLoad}
                                >
                                    {saving ? <Save /> : <Check />}
                                </Fab>
                                {saving && <CircularProgress size={68} className={classes.fabProgress} />}
                            </div>
                        </Tooltip>
                    }
                </Grid>
            </footer>
            <MessageSnackbar
                variant={snackbar.variant}
                message={snackbar.message}
                open={snackbar.open}
                onClose={() => setSnackbar('', false, undefined)}
            />
        </Grid >
    );
});