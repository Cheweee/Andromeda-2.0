import { Validation, GetOptions } from "./commonModels";
import { RoleInDepartment } from "./roleModels";

export enum DepartmentType {
    Faculty,
    TrainingDepartment
}

export interface Department {
    id?: number;
    name: string;
    fullName: string;
    parentId?: number;
    parent?: Department;
    type: DepartmentType;

    departmentRoles: RoleInDepartment[];
    departmentUsers: UserRoleInDepartment[];
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
}

export interface TrainingDepartment extends Department {
    readonly type: DepartmentType.TrainingDepartment
}

export interface DepartmentGetOptions extends GetOptions {
    type?: DepartmentType;
    parentId?: number;
    roleId?:number;
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