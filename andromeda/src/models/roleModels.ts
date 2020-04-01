import { Validation, GetOptions } from "./commonModels";
import { DepartmentType } from "./departmentModels";

export interface Role {
    id?: number;
    name: string;

    roleDepartments: RoleInDepartment[];
}

export namespace Role {
    export const initial: Role = {
        name: '',
        roleDepartments: []
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
}

export namespace RoleValidation {
    export const initial: RoleValidation = Validation.initial;
}