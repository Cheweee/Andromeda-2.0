import * as React from "react";
import { BarChart, XAxis, Bar, ResponsiveContainer, Tooltip as ChartTooltip, TooltipProps } from "recharts";
import { Card, CardContent, Typography, Grid, WithStyles, withStyles } from "@material-ui/core";
import { mergeStyles, getShortening } from "../../../utilities";
import { chartStyles, commonStyles } from "../../../muiTheme";
import { DistributionExtendedTooltipPayload, DistributionData } from "../../../models";

const styles = mergeStyles(chartStyles, commonStyles);

interface IDistributionChartTooltipProps extends TooltipProps {
    classes: Props['classes']
}

const DistributionChartTooltip = (props: IDistributionChartTooltipProps) => {
    const { classes, payload, active } = props;

    if (active && payload && payload.length > 0) {
        const extendedPayload = (payload[0] as DistributionExtendedTooltipPayload).payload;
        const lecturer = extendedPayload.lecturer;
        const lections = extendedPayload.lections;
        const practicalLessons = extendedPayload.practicalLessons;
        const laboratoryLessons = extendedPayload.laboratoryLessons;
        const thematicalDiscussions = extendedPayload.thematicalDiscussions;
        const consultations = extendedPayload.consultations;
        const exams = extendedPayload.exams;
        const offsets = extendedPayload.offsets;
        const abstracts = extendedPayload.abstracts;
        const stateExams = extendedPayload.stateExams;
        const postgraduateEntranceExams = extendedPayload.postgraduateEntranceExams;
        const practices = extendedPayload.practices;
        const departmentManagements = extendedPayload.departmentManagements;
        const studentResearchWorks = extendedPayload.studentResearchWorks;
        const courseWorks = extendedPayload.courseWorks;
        const graduationQualificationManagements = extendedPayload.graduationQualificationManagements;
        const masterProgramManagements = extendedPayload.masterProgramManagements;
        const postgraduateProgramManagements = extendedPayload.postgraduateProgramManagements;
        const others = extendedPayload.others;

        const total = extendedPayload.total;

        const lecturerName = lecturer && (lecturer.secondname + ' ' + getShortening(lecturer.firstname) + '.' + (lecturer.secondname && (getShortening(lecturer.secondname) + '.')));

        return (
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" color="primary" gutterBottom>{lecturerName}</Typography>
                    <Grid container direction="column">
                        {lections && <Typography variant="caption" className={classes.lections}>Лекции: {lections}</Typography>}
                        {practicalLessons && <Typography variant="caption" className={classes.practicalLessons}>Практ. занятия: {practicalLessons} ч.</Typography>}
                        {laboratoryLessons && <Typography variant="caption" className={classes.laboratoryLessons}>Лаб. занятия: {laboratoryLessons} ч.</Typography>}
                        {thematicalDiscussions && <Typography variant="caption" className={classes.thematicalDiscussions}>Тем. дискуссии: {thematicalDiscussions} ч.</Typography>}
                        {consultations && <Typography variant="caption" className={classes.consultations}>Консультации: {consultations} ч.</Typography>}
                        {exams && <Typography variant="caption" className={classes.exams}>Экзамены: {exams} ч.</Typography>}
                        {offsets && <Typography variant="caption" className={classes.offsets}>Зачеты: {offsets} ч.</Typography>}
                        {abstracts && <Typography variant="caption" className={classes.abstracts}>Рефераты: {abstracts} ч.</Typography>}
                        {stateExams && <Typography variant="caption" className={classes.stateExams}>Государственные экзамены: {stateExams} ч.</Typography>}
                        {postgraduateEntranceExams && <Typography variant="caption" className={classes.postgraduateEntranceExams}>Вступ. экз. в аспирантуру: {postgraduateEntranceExams}ч.</Typography>}
                        {practices && <Typography variant="caption" className={classes.practices}>Практика: {practices} ч.</Typography>}
                        {departmentManagements && <Typography variant="caption" className={classes.departmentManagements}>Рук. кафедрой: {departmentManagements} ч.</Typography>}
                        {studentResearchWorks && <Typography variant="caption" className={classes.studentResearchWorks}>НИРС: {studentResearchWorks} ч.</Typography>}
                        {courseWorks && <Typography variant="caption" className={classes.courseWorks}>КР, КП: {courseWorks} ч.</Typography>}
                        {graduationQualificationManagements && <Typography variant="caption" className={classes.graduationQualificationManagements}>Рук. ВКР: {graduationQualificationManagements} ч.</Typography>}
                        {masterProgramManagements && <Typography variant="caption" className={classes.masterProgramManagements}>Рук. программой магистратуры: {masterProgramManagements} ч.</Typography>}
                        {postgraduateProgramManagements && <Typography variant="caption" className={classes.postgraduateProgramManagements}>Рук. программой аспирантуры :{postgraduateProgramManagements} ч.</Typography>}
                        {others && <Typography variant="caption" className={classes.others}>Контрольные, РГР, ДЗ и др.: {others} ч.</Typography>}
                        {!total && <Typography variant="caption">Нагрузка еще не распределена</Typography>}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    return null;
}

interface Props extends WithStyles<typeof styles> {
    chartData: DistributionData[];
}

export const StudyLoadChart = withStyles(styles)(function (props: Props) {
    const {
        chartData,
        classes
    } = props;
    return (
        <ResponsiveContainer width="100%" minWidth={600} height={200}>
            <BarChart
                data={chartData}
            >
                <ChartTooltip
                    isAnimationActive={false}
                    cursor={false}
                    content={<DistributionChartTooltip classes={classes} />}
                />
                <Bar dataKey="total" stackId="a" className={classes.bar} />
            </BarChart>
        </ResponsiveContainer>
    );
});