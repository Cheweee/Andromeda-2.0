import { Validation, GetOptions } from "./commonModels";

export interface DisciplineTitle {
    id?: number;
    departmentId?: number;
    shortname?: string;
    name: string;
    pinned?: boolean;
}

export interface DisciplineTitleValidation extends Validation {
    shortnameError?: string;
    nameError?: string;
}

export interface DisciplineTitleGetOptions extends GetOptions {
    departmentId?: number;
    departmentsIds?: number[];
    notPinned?: boolean;
}