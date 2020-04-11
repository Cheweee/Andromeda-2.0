import { handleJsonResponse, ResponseHandler, handleResponse } from "../utilities";
import { Faculty, FacultyGetOptions, Department, TrainingDepartmentGetOptions, TrainingDepartment, DepartmentValidation, DepartmentGetOptions } from "../models";

class DepartmentService {
    public async create(department: Department): Promise<Department> {
        return fetch('api/department', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(department)
        })
            .then(handleJsonResponse as ResponseHandler<Department>);
    }

    public async update(department: Department): Promise<Department> {
        return fetch('api/department', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(department)
        })
            .then(handleJsonResponse as ResponseHandler<Department>);
    }

    public async getDepartments(options?: DepartmentGetOptions): Promise<Department[]> {
        let url = 'api/department';
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.roleId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}roleId=${options.roleId}`;
        if (options.search !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
        if (options.type !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}type=${options.type}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Department[]>);
    }

    public async getFaculties(options?: FacultyGetOptions): Promise<Faculty[]> {
        let url = 'api/department';
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.search !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;

        url += `${conditionIndex++ === 0 ? '?' : '&'}type=${options.type}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Faculty[]>);
    }

    public async getTrainingDepartments(options?: TrainingDepartmentGetOptions): Promise<TrainingDepartment[]> {
        let url = 'api/department';
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.search !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
        if (options.parentId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}parentId=${options.parentId}`;
        if (options.roleId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}roleId=${options.roleId}`;

        url += `${conditionIndex++ === 0 ? '?' : '&'}type=${options.type}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<TrainingDepartment[]>);
    }

    public async delete(ids: number[]): Promise<void> {
        return fetch('api/department', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        })
            .then(handleResponse);
    }

    private validateName(name: string): string {
        const nameValid = Boolean(name);
        return nameValid ? '' : 'Сокращение обязательно';
    }

    private validateFullName(name: string): string {
        const nameValid = Boolean(name);
        return nameValid ? '' : 'Наименование обязательно';
    }

    private validateParentId(parentId: number): string {
        const parentIdValid = Boolean(parentId);
        return parentIdValid ? '' : 'Факультет обязателен';
    }

    public validateDepartment(model: Department): DepartmentValidation {
        const nameError = this.validateName(model.name);
        const fullNameError = this.validateFullName(model.fullName);
        const isValid = !nameError
            && !fullNameError

            const facultyErrors: DepartmentValidation = {
                nameError: nameError,
                fullNameError: fullNameError,
                isValid: isValid
            };
            return facultyErrors;
    }

    public validateFaculty(model: Faculty): DepartmentValidation {
        const departmentErrors = this.validateDepartment(model);
        return departmentErrors;
    }

    public validateTrainingDepartment(model: TrainingDepartment): DepartmentValidation {
        const departmentErrors = this.validateDepartment(model);
        const parentIdError = this.validateParentId(model.parentId);
        const isValid = departmentErrors.isValid && !parentIdError

        const facultyErrors: DepartmentValidation = {
            ...departmentErrors,
            parentIdError: parentIdError,
            isValid: isValid
        };
        return facultyErrors;
    }
}

export const departmentService = new DepartmentService();