import * as React from "react";
import { mergeStyles } from "../../../utilities";
import { commonStyles, chartStyles } from "../../../muiTheme";
import { withStyles, WithStyles, Card, CardContent, Typography, Grid, Paper } from "@material-ui/core";
import { DistributionExtendedTooltipPayload as UserDisciplineLoadChartTooltipPayload, User, UserDisciplineLoad, ProjectType } from "../../../models";
import { ResponsiveContainer, Bar, BarChart, Tooltip, TooltipProps } from "recharts";
import { UserDisciplineLoadCard } from "./UserDisciplineLoadCard";

const styles = mergeStyles(commonStyles, chartStyles);

const DistributionChartTooltip = (props: TooltipProps) => {
    const { payload, active } = props;

    if (active && payload && payload.length > 0) {
        const extendedPayload = (payload[0] as UserDisciplineLoadChartTooltipPayload).payload;
        const user = extendedPayload ? extendedPayload.user : User.initial;
        const studyLoad = extendedPayload ? extendedPayload.studyLoad : [];

        const lections = studyLoad.filter(o => o.projectType === ProjectType.lection).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const practicalLessons = studyLoad.filter(o => o.projectType === ProjectType.practicalLesson).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const laboratoryLessons = studyLoad.filter(o => o.projectType === ProjectType.laboratoryLesson).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const thematicalDiscussions = studyLoad.filter(o => o.projectType === ProjectType.thematicalDiscussion).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const consultations = studyLoad.filter(o => o.projectType === ProjectType.consultation).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const exams = studyLoad.filter(o => o.projectType === ProjectType.exam).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const offsets = studyLoad.filter(o => o.projectType === ProjectType.offset).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const abstracts = studyLoad.filter(o => o.projectType === ProjectType.abstract).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const stateExams = studyLoad.filter(o => o.projectType === ProjectType.stateExam).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const postgraduateEntranceExams = studyLoad.filter(o => o.projectType === ProjectType.postgraduateEntranceExam).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const practices = studyLoad.filter(o => o.projectType === ProjectType.practice).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const departmentManagements = studyLoad.filter(o => o.projectType === ProjectType.departmentManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const studentResearchWorks = studyLoad.filter(o => o.projectType === ProjectType.studentResearchWork).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const courseWorks = studyLoad.filter(o => o.projectType === ProjectType.courseWork).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const graduationQualificationManagements = studyLoad.filter(o => o.projectType === ProjectType.graduationQualificationManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const masterProgramManagements = studyLoad.filter(o => o.projectType === ProjectType.masterProgramManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const postgraduateProgramManagements = studyLoad.filter(o => o.projectType === ProjectType.postgraduateProgramManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0);
        const others = studyLoad.filter(o => o.projectType === ProjectType.other).map(o => o.value).reduce((prev, curr) => prev + curr, 0);

        const amount = extendedPayload.amount;

        return (
            <Card>
                <CardContent>
                    <Grid container direction="column">
                        <Typography variant="subtitle1">{user && User.getFullInitials(user)}</Typography>
                        {lections > 0 && <Typography variant="caption">Лекции: {lections.toFixed(2)} ч.</Typography>}
                        {practicalLessons > 0 && <Typography variant="caption">Практ. занятия: {practicalLessons.toFixed(2)} ч.</Typography>}
                        {laboratoryLessons > 0 && <Typography variant="caption">Лаб. занятия: {laboratoryLessons.toFixed(2)} ч.</Typography>}
                        {thematicalDiscussions > 0 && <Typography variant="caption">Тем. дискуссии: {thematicalDiscussions.toFixed(2)} ч.</Typography>}
                        {consultations > 0 && <Typography variant="caption">Консультации: {consultations.toFixed(2)} ч.</Typography>}
                        {exams > 0 && <Typography variant="caption">Экзамены: {exams.toFixed(2)} ч.</Typography>}
                        {offsets > 0 && <Typography variant="caption">Зачеты: {offsets.toFixed(2)} ч.</Typography>}
                        {abstracts > 0 && <Typography variant="caption">Рефераты: {abstracts.toFixed(2)} ч.</Typography>}
                        {stateExams > 0 && <Typography variant="caption">Государственные экзамены: {stateExams.toFixed(2)} ч.</Typography>}
                        {postgraduateEntranceExams > 0 && <Typography variant="caption">Вступ. экз. в аспирантуру: {postgraduateEntranceExams.toFixed(2)}ч.</Typography>}
                        {practices > 0 && <Typography variant="caption">Практика: {practices.toFixed(2)} ч.</Typography>}
                        {departmentManagements > 0 && <Typography variant="caption">Рук. кафедрой: {departmentManagements.toFixed(2)} ч.</Typography>}
                        {studentResearchWorks > 0 && <Typography variant="caption">НИРС: {studentResearchWorks.toFixed(2)} ч.</Typography>}
                        {courseWorks > 0 && <Typography variant="caption">КР, КП: {courseWorks.toFixed(2)} ч.</Typography>}
                        {graduationQualificationManagements > 0 && <Typography variant="caption">Рук. ВКР: {graduationQualificationManagements.toFixed(2)} ч.</Typography>}
                        {masterProgramManagements > 0 && <Typography variant="caption">Рук. программой магистратуры: {masterProgramManagements.toFixed(2)} ч.</Typography>}
                        {postgraduateProgramManagements > 0 && <Typography variant="caption">Рук. программой аспирантуры :{postgraduateProgramManagements.toFixed(2)} ч.</Typography>}
                        {others > 0 && <Typography variant="caption">Контрольные, РГР, ДЗ и др.: {others.toFixed(2)} ч.</Typography>}
                        {!amount && <Typography variant="caption">Нагрузка еще не распределена</Typography>}
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    return null;
}

interface Props extends WithStyles<typeof styles> {
    chartData: UserDisciplineLoad[];
}

export const UserDisciplineLoadChart = withStyles(styles)(function (props: Props) {
    const {
        chartData,
        classes
    } = props;
    return (
        <ResponsiveContainer width="100%" minWidth={600} height={260}>
            <BarChart data={chartData}>
                <Tooltip
                    isAnimationActive={false}
                    cursor={false}
                    content={<DistributionChartTooltip />}
                />
                <Bar dataKey="amount" stackId="a" className={classes.bar} />
            </BarChart>
        </ResponsiveContainer>
    );
});