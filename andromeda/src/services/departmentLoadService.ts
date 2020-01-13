import { DepartmentLoad, DepartmentLoadGetOptions, DepartmentLoadImportOptions } from "../models";
import { ResponseHandler, handleJsonResponse, handleResponse } from "../utilities";

class DepartmentLoadService {
    private readonly apiUrl: string = 'api/departmentload';
    private readonly jsonHeaders = { 'Content-Type': 'application/json' };

    public async create(departmentLoad: DepartmentLoad): Promise<DepartmentLoad> {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'POST',
            headers: this.jsonHeaders,
            body: JSON.stringify(departmentLoad)
        }).then(handleJsonResponse as ResponseHandler<DepartmentLoad>);
    }

    public async update(departmentLoad: DepartmentLoad): Promise<DepartmentLoad> {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'PATCH',
            headers: this.jsonHeaders,
            body: JSON.stringify(departmentLoad)
        }).then(handleJsonResponse as ResponseHandler<DepartmentLoad>);
    }

    public async import(options: DepartmentLoadImportOptions) {
        let url = `${this.apiUrl}/import`;
        let conditionIndex: number = 0;
        if (options.departmentId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentId=${options.departmentId}`;
        if (options.fileName)
            url += `${conditionIndex++ === 0 ? '?' : '&'}fileName=${options.fileName}`;
        if (options.updateDisciplinesTitles)
            url += `${conditionIndex++ === 0 ? '?' : '&'}updateDisciplinesTitles=${options.updateDisciplinesTitles}`;
        if (options.updateStudentsGroups)
            url += `${conditionIndex++ === 0 ? '?' : '&'}updateStudentsGroups=${options.updateStudentsGroups}`;
        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: this.jsonHeaders,
            body: options.file
        }).then(handleJsonResponse as ResponseHandler<DepartmentLoad>);
    }

    public async generate(departmentLoad: DepartmentLoad): Promise<DepartmentLoad> {
        const url = `${this.apiUrl}/generate`
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'POST',
            headers: this.jsonHeaders,
            body: JSON.stringify(departmentLoad)
        }).then(handleJsonResponse as ResponseHandler<DepartmentLoad>);
    }

    public async getDepartmentLoads(options?: DepartmentLoadGetOptions) {
        let url = this.apiUrl;
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.departmentId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentId=${options.departmentId}`

        return fetch(url, {
            credentials: 'include',
            method: 'GET'
        }).then(handleJsonResponse as ResponseHandler<DepartmentLoad[]>);
    }

    public async delete(ids: number[]): Promise<void> {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'DELETE',
            headers: this.jsonHeaders,
            body: JSON.stringify(ids)
        }).then(handleResponse);
    }
}

export const departmentLoadService = new DepartmentLoadService();