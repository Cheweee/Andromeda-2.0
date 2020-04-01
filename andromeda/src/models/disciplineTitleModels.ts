import { Validation, GetOptions } from "./commonModels";

export interface DisciplineTitle {
    id?: number;
    departmentId?: number;
    shortname?: string;
    name: string;
    pinned?: boolean;
}

export namespace DisciplineTitle {
    export const initial: DisciplineTitle = { name: '' };
}

export interface DisciplineTitleValidation extends Validation {
    shortnameError?: string;
    nameError?: string;
}

export namespace DisciplineTitleValidation {
    export const initial: DisciplineTitleValidation = Validation.initial;
}

export interface DisciplineTitleGetOptions extends GetOptions {
    departmentId?: number;
    departmentsIds?: number[];
    notPinned?: boolean;
}