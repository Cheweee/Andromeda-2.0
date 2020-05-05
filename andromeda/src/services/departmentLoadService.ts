import { DepartmentLoad, DepartmentLoadGetOptions, DepartmentLoadImportOptions, StudyLoad, ProjectType, GroupDisciplineLoad, GroupDisciplineLoadValidation, DisciplineTitle, StudentGroup, UserDisciplineLoadValidation, UserDisciplineLoad, User, DepartmentLoadGenerateOptions } from "../models";
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

    public async generate(options: DepartmentLoadGenerateOptions): Promise<DepartmentLoad> {
        const url = `${this.apiUrl}/generate`
        return fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: this.jsonHeaders,
            body: JSON.stringify(options)
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
            url += `${conditionIndex++ === 0 ? '?' : '&'}departmentId=${options.departmentId}`;
        if (options.search)
            url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;

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

    public isStudyLoadForGroup(load: StudyLoad[]) {
        return !load.find(o => o.projectType === ProjectType.practice
            || o.projectType === ProjectType.departmentManagement
            || o.projectType === ProjectType.graduationQualificationManagement
            || o.projectType === ProjectType.masterProgramManagement
            || o.projectType === ProjectType.studentResearchWork)
    }

    private validateDisciplineTitle(value: DisciplineTitle): string {
        const isValid = Boolean(value && value.id);
        return isValid ? '' : 'Учебная дисциплина обязательна';
    }

    private validateStudentGroup(value: StudentGroup): string {
        const isValid = Boolean(value && value.id);
        return isValid ? '' : 'Учебная группа обязательна';
    }

    private validateSemesterNumber(value: number): string {
        const moreThanZero = value && value > 0;
        if (!moreThanZero)
            return 'Номер семестра должен быть больше нуля'

        const lessMaxValue = value && value <= 10;
        if (!lessMaxValue)
            return 'Номер семестра должен быть меньше 10';

        return '';
    }

    public validateGroupDisciplineLoad(value: GroupDisciplineLoad): GroupDisciplineLoadValidation {
        const disciplineTitleError = this.validateDisciplineTitle(value.disciplineTitle);
        const studentGroupError = this.validateStudentGroup(value.studentGroup);
        const semesterNumberError = this.validateSemesterNumber(value.semesterNumber);

        //TODO: Доделать валидацию типов работ
        const isValid = !disciplineTitleError && !studentGroupError && !semesterNumberError;

        return {
            disciplineTitleError: disciplineTitleError,
            studentGroupError: studentGroupError,
            semesterNumberError: semesterNumberError,
            isValid: isValid
        };
    }

    public validateGroupDisciplineLoadNotNull(value: GroupDisciplineLoad): string {
        const isValid = Boolean(value);
        return isValid ? '' : 'Выберите нагрузку чтобы распределить на пользователя';
    }

    private validateUser(value: User): string {
        const isValid = Boolean(value);
        return isValid ? '' : 'Выберите пользователя, на которого распределить нагрузку';
    }

    private validateStudyLoad(value: StudyLoad[]) {
        const isValid = Boolean(value);
        return isValid ? '' : 'Невозможно распределить нагрузку не указав работы';
    }

    public validateUserDisciplineLoad(value: UserDisciplineLoad): UserDisciplineLoadValidation {
        const userError: string = this.validateUser(value.user);
        const studyLoadError: string = this.validateStudyLoad(value.studyLoad);

        const isValid = !userError && !studyLoadError;

        return {
            userError: userError,
            studyLoadError: studyLoadError,
            isValid: isValid
        };
    }
}

export const departmentLoadService = new DepartmentLoadService();