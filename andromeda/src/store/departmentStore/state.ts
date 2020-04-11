import { Department, DepartmentValidation, TrainingDepartment } from "../../models"

export type DepartmentsLoading = {
    loading: true;
}

export type DepartmentsLoaded = {
    loading: false;
    departments: Department[];
}

export type DepartmentState = DepartmentsLoading | DepartmentsLoaded;