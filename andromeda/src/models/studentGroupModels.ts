import { StudyDirection } from "./studyDirectionModels";
import { Validation } from "./commonModels";

export interface StudentGroup {
    id?: number;
    studyLoadId?: number;
    departmentId?: number;
    studyDirectionId: number;
    name: string;
    studentsCount: number;
    startYear: number;
    currentCourse: number;

    studyDirection?: StudyDirection;
}

export interface StudentGroupValidation extends Validation {
    studyDirectionError?: string;
    studentsCountError?: string;
    startYearError?: string;
    nameError?: string;
}