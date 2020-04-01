import { Validation } from "./commonModels";

export interface StudyDirection {
    id?: number;
    departmentId?: number;
    code: string;
    name: string;
    shortName: string;
}

export namespace StudyDirection {
    export const initial: StudyDirection = {
        code: '',
        name: '',
        shortName: ''
    }
}

export interface StudyDirectionValidation extends Validation {
    nameError?: string;
    shortNameError?: string;
    codeError?: string;
}