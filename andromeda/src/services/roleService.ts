import { handleJsonResponse, ResponseHandler, handleResponse } from "../utilities";

import { RoleGetOptions, Role, RoleValidation } from "../models";

class RoleService {
    public async create(model: Role): Promise<Role> {
        return fetch('api/role', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<Role>);
    }

    public async update(model: Role): Promise<Role> {
        return fetch('api/role', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<Role>);
    }

    public async getFaculties(options?: RoleGetOptions): Promise<Role[]> {
        let url = 'api/role';
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.search !== undefined)
            url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Role[]>);
    }

    public async delete(ids: number[]): Promise<void> {
        return fetch('api/role', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        })
            .then(handleResponse);
    }

    private validateName(name: string): string {
        const nameValid = Boolean(name);
        return nameValid ? '' : 'Наименование обязательно';
    }

    public validateRole(faculty: Role) {
        const nameError = this.validateName(faculty.name);
        const isValid = !nameError;

        const facultyErrors: RoleValidation = {
            nameError: nameError,
            isValid: isValid
        };
        return facultyErrors;
    }
}

export const roleService = new RoleService();