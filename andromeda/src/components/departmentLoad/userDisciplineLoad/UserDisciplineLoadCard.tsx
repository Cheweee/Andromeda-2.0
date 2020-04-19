import * as React from "react";
import { commonStyles, chartStyles } from "../../../muiTheme";
import { WithStyles, withStyles, Grid, Card, CardHeader, Typography, CardContent, CardActions, IconButton, Tooltip, Button } from "@material-ui/core";
import { mergeStyles } from "../../../utilities";
import { UserDisciplineLoad, User, ProjectType } from "../../../models";
import { Visibility, Edit, Delete, PermContactCalendar } from "@material-ui/icons";

const styles = mergeStyles(commonStyles, chartStyles);

interface Props extends WithStyles<typeof styles> {
    readonly userDisciplineLoad: UserDisciplineLoad;
    readonly index?: number;

    onEdit: (index: number) => void;
    onDelete: (userId: number) => void;
}

export const UserDisciplineLoadCard = withStyles(styles)(function (props: Props) {
    const [user, setUser] = React.useState<User>(User.initial);
    const [lections, setLections] = React.useState<number>(0);
    const [practicalLessons, setPracticalLessons] = React.useState<number>(0);
    const [laboratoryLessons, setLaboratoryLessons] = React.useState<number>(0);
    const [thematicalDiscussions, setThematicalDiscussions] = React.useState<number>(0);
    const [consultations, setConsultations] = React.useState<number>(0);
    const [exams, setExams] = React.useState<number>(0);
    const [offsets, setOffsets] = React.useState<number>(0);
    const [abstracts, setAbstracts] = React.useState<number>(0);
    const [stateExams, setStateExams] = React.useState<number>(0);
    const [postgraduateEntranceExams, setPostgraduateEntranceExams] = React.useState<number>(0);
    const [practices, setPractices] = React.useState<number>(0);
    const [departmentManagements, setDepartmentManagements] = React.useState<number>(0);
    const [studentResearchWorks, setStudentResearchWorks] = React.useState<number>(0);
    const [courseWorks, setCourseWorks] = React.useState<number>(0);
    const [graduationQualificationManagements, setGraduationQualificationManagements] = React.useState<number>(0);
    const [masterProgramManagements, setMasterProgramManagements] = React.useState<number>(0);
    const [postgraduateProgramManagements, setPostgraduateProgramManagements] = React.useState<number>(0);
    const [others, setOthers] = React.useState<number>(0);
    const [amount, setAmount] = React.useState<number>(0);

    React.useEffect(() => {
        const userDisciplineLoad = props.userDisciplineLoad;
        const user = userDisciplineLoad ? userDisciplineLoad.user : User.initial;
        const studyLoad = userDisciplineLoad ? userDisciplineLoad.studyLoad : [];

        setLections(studyLoad.filter(o => o.projectType === ProjectType.lection).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setPracticalLessons(studyLoad.filter(o => o.projectType === ProjectType.practicalLesson).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setLaboratoryLessons(studyLoad.filter(o => o.projectType === ProjectType.laboratoryLesson).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setThematicalDiscussions(studyLoad.filter(o => o.projectType === ProjectType.thematicalDiscussion).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setConsultations(studyLoad.filter(o => o.projectType === ProjectType.consultation).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setExams(studyLoad.filter(o => o.projectType === ProjectType.exam).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setOffsets(studyLoad.filter(o => o.projectType === ProjectType.offset).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setAbstracts(studyLoad.filter(o => o.projectType === ProjectType.abstract).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setStateExams(studyLoad.filter(o => o.projectType === ProjectType.stateExam).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setPostgraduateEntranceExams(studyLoad.filter(o => o.projectType === ProjectType.postgraduateEntranceExam).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setPractices(studyLoad.filter(o => o.projectType === ProjectType.practice).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setDepartmentManagements(studyLoad.filter(o => o.projectType === ProjectType.departmentManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setStudentResearchWorks(studyLoad.filter(o => o.projectType === ProjectType.studentResearchWork).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setCourseWorks(studyLoad.filter(o => o.projectType === ProjectType.courseWork).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setGraduationQualificationManagements(studyLoad.filter(o => o.projectType === ProjectType.graduationQualificationManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setMasterProgramManagements(studyLoad.filter(o => o.projectType === ProjectType.masterProgramManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setPostgraduateProgramManagements(studyLoad.filter(o => o.projectType === ProjectType.postgraduateProgramManagement).map(o => o.value).reduce((prev, curr) => prev + curr, 0));
        setOthers(studyLoad.filter(o => o.projectType === ProjectType.other).map(o => o.value).reduce((prev, curr) => prev + curr, 0));

        const amount = userDisciplineLoad.amount;

        setUser(user);

        setAmount(amount);
    }, [props.userDisciplineLoad]);

    const {
        index,
        classes,

        onEdit,
        onDelete
    } = props;
    return (
        <Card key={index}>
            <CardHeader title={user && User.getFullInitials(user)} />
            <CardContent>
                <Grid container direction="column">
                    {lections > 0 && <Typography variant="caption" className={classes.lections}>Лекции: {lections.toFixed(2)} ч.</Typography>}
                    {practicalLessons > 0 && <Typography variant="caption" className={classes.practicalLessons}>Практ. занятия: {practicalLessons.toFixed(2)} ч.</Typography>}
                    {laboratoryLessons > 0 && <Typography variant="caption" className={classes.laboratoryLessons}>Лаб. занятия: {laboratoryLessons.toFixed(2)} ч.</Typography>}
                    {thematicalDiscussions > 0 && <Typography variant="caption" className={classes.thematicalDiscussions}>Тем. дискуссии: {thematicalDiscussions.toFixed(2)} ч.</Typography>}
                    {consultations > 0 && <Typography variant="caption" className={classes.consultations}>Консультации: {consultations.toFixed(2)} ч.</Typography>}
                    {exams > 0 && <Typography variant="caption" className={classes.exams}>Экзамены: {exams.toFixed(2)} ч.</Typography>}
                    {offsets > 0 && <Typography variant="caption" className={classes.offsets}>Зачеты: {offsets.toFixed(2)} ч.</Typography>}
                    {abstracts > 0 && <Typography variant="caption" className={classes.abstracts}>Рефераты: {abstracts.toFixed(2)} ч.</Typography>}
                    {stateExams > 0 && <Typography variant="caption" className={classes.stateExams}>Государственные экзамены: {stateExams.toFixed(2)} ч.</Typography>}
                    {postgraduateEntranceExams > 0 && <Typography variant="caption" className={classes.postgraduateEntranceExams}>Вступ. экз. в аспирантуру: {postgraduateEntranceExams.toFixed(2)}ч.</Typography>}
                    {practices > 0 && <Typography variant="caption" className={classes.practices}>Практика: {practices.toFixed(2)} ч.</Typography>}
                    {departmentManagements > 0 && <Typography variant="caption" className={classes.departmentManagements}>Рук. кафедрой: {departmentManagements.toFixed(2)} ч.</Typography>}
                    {studentResearchWorks > 0 && <Typography variant="caption" className={classes.studentResearchWorks}>НИРС: {studentResearchWorks.toFixed(2)} ч.</Typography>}
                    {courseWorks > 0 && <Typography variant="caption" className={classes.courseWorks}>КР, КП: {courseWorks.toFixed(2)} ч.</Typography>}
                    {graduationQualificationManagements > 0 && <Typography variant="caption" className={classes.graduationQualificationManagements}>Рук. ВКР: {graduationQualificationManagements.toFixed(2)} ч.</Typography>}
                    {masterProgramManagements > 0 && <Typography variant="caption" className={classes.masterProgramManagements}>Рук. программой магистратуры: {masterProgramManagements.toFixed(2)} ч.</Typography>}
                    {postgraduateProgramManagements > 0 && <Typography variant="caption" className={classes.postgraduateProgramManagements}>Рук. программой аспирантуры :{postgraduateProgramManagements.toFixed(2)} ч.</Typography>}
                    {others > 0 && <Typography variant="caption" className={classes.others}>Контрольные, РГР, ДЗ и др.: {others.toFixed(2)} ч.</Typography>}
                    {!amount && <Typography variant="caption">Нагрузка еще не распределена</Typography>}
                </Grid>
            </CardContent>
            <CardActions>
                <Grid container direction="row">
                    <Grid item xs/>
                    <Button>Детали</Button>
                </Grid>
            </CardActions>
        </Card>
    );
});