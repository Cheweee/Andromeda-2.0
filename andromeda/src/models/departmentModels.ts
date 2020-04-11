import { Validation, GetOptions } from "./commonModels";
import { RoleInDepartment } from "./roleModels";
import { StudentGroup } from "./studentGroupModels";
import { StudyDirection } from "./studyDirectionModels";
import { DisciplineTitle } from "./disciplineTitleModels";

export enum DepartmentType {
    Faculty,
    TrainingDepartment
}

export namespace DepartmentType {
    export function getProjectTypeDescription(value: DepartmentType) {
        switch (value) {
            case DepartmentType.Faculty: return 'Факультет';
            case DepartmentType.TrainingDepartment: return 'Кафедры';
            default: return 'Департамент';
        }
    }
}

export interface Department {
    id?: number;
    name: string;
    fullName: string;
    parentId?: number;
    parent?: Department;
    type: DepartmentType;

    roles: RoleInDepartment[];
    users: UserRoleInDepartment[];
}

export namespace Department {
    export const initial: Department = {
        name: '',
        fullName: '',
        type: null,

        roles: [],
        users: []
    };
}

export interface UserRoleInDepartment {
    id?: number;
    roleInDepartmentId;
    roleId?: number;
    userId?: number;
    departmentId?: number;

    roleName: string;
    departmentName: string;
    userFullName: string;
}

export interface Faculty extends Department {
    readonly type: DepartmentType.Faculty
    
    departments: TrainingDepartment[];
}

export namespace Faculty {
    export const initial: Faculty = {
        fullName: '',
        name: '',
        roles: [],
        type: DepartmentType.Faculty,
        users: [],

        departments: []
    };
}

export interface TrainingDepartment extends Department {
    readonly type: DepartmentType.TrainingDepartment

    groups: StudentGroup[];
    studyDirections: StudyDirection[];
    titles: DisciplineTitle[];
}

export namespace TrainingDepartment {
    export const initial: TrainingDepartment = {
        fullName: '',
        name: '',
        roles: [],
        type: DepartmentType.TrainingDepartment,
        users: [],
        groups: [],
        studyDirections: [],
        titles: []
    }
}

export interface DepartmentGetOptions extends GetOptions {
    type?: DepartmentType;
    parentId?: number;
    roleId?: number;
}

export interface FacultyGetOptions extends DepartmentGetOptions {
    readonly type: DepartmentType.Faculty
}

export interface TrainingDepartmentGetOptions extends DepartmentGetOptions {
    readonly type: DepartmentType.TrainingDepartment;
}

export interface DepartmentValidation extends Validation {
    nameError?: string;
    fullNameError?: string;
    parentIdError?: string;
}

export namespace DepartmentValidation {
    export const initial: DepartmentValidation = Validation.initial;
}