import { handleResponse, handleJsonResponse, ResponseHandler } from "../utilities";
import { StudyLoadGetOptions, StudyLoad } from "../models";

class StudyLoadService {
    private readonly apiUrl: string = '/api/studyload';
    private readonly headers: { 'Content-Type': 'application/json' };

    public async get(options?: StudyLoadGetOptions): Promise<StudyLoad[]> {
        let url = this.apiUrl;
        let conditionIndex: number = 0;
        if (options.departmentId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentId=${options.departmentId}`;
        if (options.onlyNotDistributed)
            url += `${conditionIndex++ === 0 ? '?' : '&'}onlyNotDistributed=${options.onlyNotDistributed}`;
        if (options.onlyDistributed)
            url += `${conditionIndex++ === 0 ? '?' : '&'}onlyDistributed=${options.onlyDistributed}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET'
        }).then(handleJsonResponse as ResponseHandler<StudyLoad[]>);
    }

    public async create(departmentLoad: StudyLoad[]) {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(departmentLoad)
        }).then(handleJsonResponse as ResponseHandler<StudyLoad[]>);
    }

    public async update(departmentLoad: StudyLoad[]) {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(departmentLoad)
        }).then(handleJsonResponse as ResponseHandler<StudyLoad[]>);
    }

    public async delete(ids: number[]) {
        return fetch(this.apiUrl, {
            credentials: 'include',
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify(ids)
        }).then(handleResponse);
    }
}

export const studyLoadService = new StudyLoadService();