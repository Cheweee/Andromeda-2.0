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

    public async getRoles(options?: RoleGetOptions): Promise<Role[]> {
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

    private validateMinLoad(canTeach: boolean, minLoad: number) {
        if(!canTeach) return '';

        if(!minLoad || minLoad <= 0) return 'Минимальная нагрузка должна быть больше 0';

        return '';
    }

    private validateMaxLoad(canTeach: boolean, minLoad: number, maxLoad: number) {
        if(!canTeach) return '';

        if(!maxLoad || maxLoad <= 0) return 'Максимальная нагрузка должна быть больше 0';
        
        if(maxLoad <= minLoad) return 'Максимальная нагрузка должна быть больше минимальной';

        return '';
    }

    public validateRole(model: Role) {
        const nameError = this.validateName(model.name);
        const minLoadError = this.validateMinLoad(model.canTeach, model.minLoad);
        const maxLoadError = this.validateMaxLoad(model.canTeach, model.minLoad, model.maxLoad);
        const isValid = !nameError && !minLoadError && !maxLoadError;

        const facultyErrors: RoleValidation = {
            nameError: nameError,
            minLoadError: minLoadError,
            maxLoadError: maxLoadError,
            isValid: isValid
        };
        return facultyErrors;
    }
}

export const roleService = new RoleService();