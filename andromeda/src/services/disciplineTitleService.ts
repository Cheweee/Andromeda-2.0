import { handleJsonResponse, ResponseHandler, handleResponse } from "../utilities";

import { DisciplineTitleGetOptions, DisciplineTitle } from "../models";

class DisciplineTitleService {
    public async getTitles(options?: DisciplineTitleGetOptions): Promise<DisciplineTitle[]> {
        let url = 'api/disciplinetitle/notpinned';
        let conditionIndex: number = 0;
        if (options.id)
            url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
        if (options.ids)
            url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
        if (options.departmentId)
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentId=${options.departmentId}`;
        if (options.departmentsIds)
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentsIds=${options.departmentsIds}`;

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<DisciplineTitle[]>);
    }
}

export const disciplinetitleService = new DisciplineTitleService();