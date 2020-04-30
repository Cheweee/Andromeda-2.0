import { GetOptions, StudyLoad, User } from ".";
import { TooltipPayload } from "recharts";
import { Validation } from "./commonModels";
import { DisciplineTitle } from "./disciplineTitleModels";
import { StudentGroup } from "./studentGroupModels";
import { Faculty } from "./departmentModels";

export interface DepartmentLoad {
    id?: number;
    departmentId?: number;
    studyYear: string;
    total: number;

    groupDisciplineLoad?: GroupDisciplineLoad[];
    userDisciplineLoad?: UserDisciplineLoad[];
}

export namespace DepartmentLoad {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    export const currentStudyYear = currentYear + ' - ' + nextYear;
    export const initial: DepartmentLoad = {
        studyYear: currentStudyYear,
        total: 0
    }
}

export interface DepartmentLoadGetOptions extends GetOptions {
    departmentId?: number;
    departmentIds?: number[];
    search?: string;
}

export interface DepartmentLoadImportOptions {
    departmentId?: number;
    file?: File;
    fileName?: string;
    updateDisciplinesTitles?: boolean;
    updateStudentsGroups?: boolean;
}

export namespace DepartmentLoadImportOptions {
    export const initial: DepartmentLoadImportOptions = {};
}

export interface GroupDisciplineLoad {
    id?: number;
    disciplineTitleId: number;
    disciplineTitle: DisciplineTitle;
    studentGroupId: number;
    studentGroup: StudentGroup;
    semesterNumber: number;
    facultyId?: number;
    faculty?: Faculty;
    amount: number;

    studyLoad?: StudyLoad[];
}

export namespace GroupDisciplineLoad {
    export const initial: GroupDisciplineLoad = {
        amount: 0,
        disciplineTitle: DisciplineTitle.initial,
        disciplineTitleId: 0,
        faculty: Faculty.initial,
        facultyId: 0,
        semesterNumber: 0,
        studentGroup: StudentGroup.initial,
        studentGroupId: 0,
        studyLoad: []
    };

    export function getDescription(groupDisciplineLoad: GroupDisciplineLoad): string {
        if (!groupDisciplineLoad ||
            !groupDisciplineLoad.disciplineTitle ||
            !groupDisciplineLoad.studentGroup ||
            !groupDisciplineLoad.semesterNumber ||
            !groupDisciplineLoad.amount)
            return '';
        const {
            disciplineTitle,
            studentGroup,
            semesterNumber,
            amount
        } = groupDisciplineLoad;

        return `${disciplineTitle.name} ${semesterNumber} сем. ${studentGroup.name} (${studentGroup.studentsCount} ст.) Всего: ${amount} ч.`;
    }
}

export interface GroupDisciplineLoadValidation extends Validation {
    disciplineTitleError?: string;
    studentGroupError?: string;
    semesterNumberError?: string;
    facultyError?: string;
    studyLoadsError?: string;
}

export namespace GroupDisciplineLoadValidation {
    export const initial: GroupDisciplineLoadValidation = Validation.initial;
}

export interface UserDisciplineLoad {
    user: User;
    studyLoad: StudyLoad[];
    amount?: number;
}

export interface UserDisciplineLoadValidation extends Validation {
    userError?: string;
    groupDiscplineLoadError?: string;
    studyLoadError?: string;
}

export namespace UserDisciplineLoadValidation {
    export const initial: UserDisciplineLoadValidation = Validation.initial;
}

export interface DepartmentLoadImportOptionsValidation extends Validation {
    fileError?: string;
}

export namespace DepartmentLoadImportOptionsValidation {
    export const initial: DepartmentLoadImportOptionsValidation = Validation.initial;
}

export interface DistributionExtendedTooltipPayload extends TooltipPayload {
    payload: UserDisciplineLoad;
}

export interface DistributionBarData {
    id?: number;
    lecturer: User;
    lections?: number,
    practicalLessons?: number,
    laboratoryLessons?: number,
    thematicalDiscussions?: number,
    consultations?: number,
    exams?: number,
    offsets?: number,
    abstracts?: number,
    stateExams?: number,
    postgraduateEntranceExams?: number,
    practices?: number,
    departmentManagements?: number,
    studentResearchWorks?: number,
    courseWorks?: number,
    graduationQualificationManagements?: number,
    masterProgramManagements?: number,
    postgraduateProgramManagements?: number,
    others?: number

    total: number;
    editable?: boolean;
}