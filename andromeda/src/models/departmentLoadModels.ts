import { GetOptions, StudyLoad,User } from ".";
import { TooltipPayload } from "recharts";

export interface DepartmentLoad {
    id?: number;
    departmentId?: number;
    studyYears: string;
    totalLoad: number;

    studyLoad?: StudyLoad[];
}

export interface DepartmentLoadGetOptions extends GetOptions {
    departmentId?: number;
    departmentIds?: number[];
}

export interface DistributionExtendedTooltipPayload extends TooltipPayload {
    payload: DistributionData;
}

export interface DistributionData {
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