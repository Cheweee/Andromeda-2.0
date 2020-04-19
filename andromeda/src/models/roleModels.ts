import { Validation, GetOptions } from "./commonModels";
import { DepartmentType } from "./departmentModels";

export interface Role {
    id?: number;
    name: string;
    canTeach: boolean;
    minLoad?: number;
    maxLoad?: number;

    roleDepartments: RoleInDepartment[];
}

export namespace Role {
    export const initial: Role = {
        name: '',
        roleDepartments: [],
        canTeach: false,
        minLoad: null,
        maxLoad: null
    }
}

export interface RoleInDepartment {
    id?: number;
    roleId?: number;
    departmentId?: number;
    departmentType?: DepartmentType;
    roleName?: string;
    departmentName?: string;
}

export interface RoleGetOptions extends GetOptions {

}

export interface RoleValidation extends Validation {
    nameError?: string;
    minLoadError?: string;
    maxLoadError?: string;
}

export namespace RoleValidation {
    export const initial: RoleValidation = Validation.initial;
}