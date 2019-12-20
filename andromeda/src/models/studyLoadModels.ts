import {
    ProjectType,
    User,
    Faculty,
    TrainingDepartment,
    DisciplineTitle,
    StudentGroup
} from ".";

export interface StudyLoad {
    id?: number;
    userId?: number;
    facultyId: number;
    departmentId: number;
    disciplineTitleId: number;
    semesterNumber: number;
    studyWeeksCount: number;
    groupsInTheStream: number;
    value: number;
    projectType: ProjectType;

    user: User;
    faculty: Faculty;
    department: TrainingDepartment;
    disciplineTitle: DisciplineTitle;
    groups: StudentGroup[];
}

export interface StudyLoadGetOptions {
    departmentId?: number
    onlyNotDistributed?: boolean;
    onlyDistributed?: boolean;
}