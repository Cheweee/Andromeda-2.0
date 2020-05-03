import { Padding } from "@material-ui/core/TableCell";

export interface Column {
    name: string;
    displayName: string;
    padding?: Padding,
    render?: (data: any) => JSX.Element;
}

export interface Validation {
    isValid: boolean;
}

export namespace Validation {
    export const initial: Validation = { isValid: false };
}

export interface GetOptions {
    id?: number;
    ids?: number[];
    search?: string;
}

export enum SnackbarVariant {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info'
}

export enum ProjectType {
    lection,
    practicalLesson,
    laboratoryLesson,
    thematicalDiscussion,
    consultation,
    exam,
    offset,
    abstract,
    esTestPapers,
    stateExam,
    postgraduateEntranceExam,
    practice,
    departmentManagement,
    studentResearchWork,
    courseWork,
    graduationQualificationManagement,
    masterProgramManagement,
    postgraduateProgramManagement,
    other
}

export namespace ProjectType {
    export function getProjectTypeDescription(value: ProjectType) {
        switch (value) {
            case ProjectType.lection: return 'Лекции';
            case ProjectType.practicalLesson: return 'Практические занятия';
            case ProjectType.laboratoryLesson: return 'Лабораторные занятия';
            case ProjectType.thematicalDiscussion: return 'Тематические дискусии';
            case ProjectType.consultation: return 'Консультации';
            case ProjectType.exam: return 'Экзамены';
            case ProjectType.offset: return 'Зачеты';
            case ProjectType.abstract: return 'Рефераты';
            case ProjectType.stateExam: return 'Государственные экзамены';
            case ProjectType.postgraduateEntranceExam: return 'Вступительные экзамены в аспирантуру';
            case ProjectType.practice: return 'Практика';
            case ProjectType.departmentManagement: return 'Руководство кафедрой';
            case ProjectType.studentResearchWork: return 'НИРС';
            case ProjectType.courseWork: return 'КР, КП';
            case ProjectType.graduationQualificationManagement: return 'Рук. ВКР';
            case ProjectType.masterProgramManagement: return 'Рук. программой магистратуры';
            case ProjectType.postgraduateProgramManagement: return 'Рук. программой аспирантуры';
            case ProjectType.other: return 'Контрольные, РГР, ДЗ и др.';
            default: return 'Неизвестный тип работ';
        }
    }

    export function isProjectTypeDistributedByStudent(value: ProjectType): boolean {
        switch(value) {
            case ProjectType.graduationQualificationManagement: return true;

            default: false;
        }
    }
}

export const ProjectTypes = [
    ProjectType.lection,
    ProjectType.practicalLesson,
    ProjectType.laboratoryLesson,
    ProjectType.thematicalDiscussion,
    ProjectType.consultation,
    ProjectType.exam,
    ProjectType.offset,
    ProjectType.abstract,
    ProjectType.stateExam,
    ProjectType.postgraduateEntranceExam,
    ProjectType.practice,
    ProjectType.departmentManagement,
    ProjectType.studentResearchWork,
    ProjectType.courseWork,
    ProjectType.graduationQualificationManagement,
    ProjectType.masterProgramManagement,
    ProjectType.postgraduateProgramManagement,
    ProjectType.other
]