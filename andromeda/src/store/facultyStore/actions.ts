import { Action } from "redux";
import { FacultyGetOptions, Faculty, ApplicationError, TrainingDepartment, DepartmentValidation, User, RoleInDepartment, AppThunkAction, SnackbarVariant, AppThunkDispatch, AppState, DepartmentType } from "../../models";
import { departmentService } from "../../services";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getFacultiesRequest = 'GET_FACULTIES_REQUEST',
    getFacultiesSuccess = 'GET_FACULTIES_SUCCESS',
    getFacultiesFailure = 'GET_FACULTIES_FAILURE',

    getFacultyRequest = 'GET_FACULTY_REQUEST',
    getFacultySuccess = 'GET_FACULTY_SUCCESS',
    getFacultyFailure = 'GET_FACULTY_FAILURE',

    updateFacultyDetails = 'UPDATE_FACULTY_DETAILS',

    updateFacultyUsers = 'UPDATE_FACULTY_USERS',
    deleteFacultyUsers = 'DELETE_FACULTY_USERS',

    updateFacultyDepartments = 'UPDATE_FACULTY_DEPARTMENTS',
    deleteFacultyDepartments = 'DELETE_FACULTY_DEPARTMENTS',

    saveRequest = 'SAVE_FACULTY_REQUEST',
    createSuccess = 'CREATE_FACULTY_SUCCESS',
    updateSuccess = 'UPDATE_FACULTY_SUCCESS',
    saveFailure = 'SAVE_FACULTY_FAILURE',

    deleteRequest = 'DELETE_FACULTY_REQUEST',
    deleteSuccess = 'DELETE_FACULTY_SUCCESS',
    deleteFailure = 'DELETE_FACULTY_FAILURE',

    clearFacultyEditionState = 'CLEAR_FACULTY_EDITION_STATE',

    validateFaculty = 'VALIDATE_FACULTY'
}
//#endregion

//#region Actions types interfaces
//#region Get faculties actions
export interface GetFacultiesRequest extends Action<ActionType> {
    type: ActionType.getFacultiesRequest;
    options: FacultyGetOptions;
}
export interface GetFacultiesSuccess extends Action<ActionType> {
    type: ActionType.getFacultiesSuccess;
    faculties: Faculty[];
}
export interface GetFacultiesFailure extends Action<ActionType> {
    type: ActionType.getFacultiesFailure;
    error: ApplicationError;
}
//#endregion

//#region Get faculty actions
export interface GetFacultyRequest extends Action<ActionType> {
    type: ActionType.getFacultyRequest;
    id?: number;
}
export interface GetFacultySuccess extends Action<ActionType> {
    type: ActionType.getFacultySuccess;
    faculty: Faculty;
}
export interface GetFacultyFailure extends Action<ActionType> {
    type: ActionType.getFacultyFailure;
    error: ApplicationError;
}
//#endregion

//#region Update faculty actions
export interface UpdateFacultyDetails {
    type: ActionType.updateFacultyDetails;
    faculty: Faculty;
    formErrors: DepartmentValidation;
}
export interface UpdateFacultyDepartments extends Action<ActionType> {
    type: ActionType.updateFacultyDepartments;
    departments: TrainingDepartment[];
}
export interface DeleteFacultyDepartments extends Action<ActionType> {
    type: ActionType.deleteFacultyDepartments;
    id: number;
}
//#endregion

//#region Save faculty actions
export interface SaveFacultyRequest extends Action<ActionType> {
    type: ActionType.saveRequest;
    department: Faculty;
}
export interface CreateFacultySuccess extends Action<ActionType> {
    type: ActionType.createSuccess;
    department: Faculty;
}
export interface UpdateFacultySuccess extends Action<ActionType> {
    type: ActionType.updateSuccess;
    department: Faculty;
}
export interface SaveFacultyFailure extends Action<ActionType> {
    type: ActionType.saveFailure;
    error: ApplicationError;
}
//#endregion

//#region Update faculty users actions
export interface UpdateFacultyUsers extends Action<ActionType> {
    type: ActionType.updateFacultyUsers;
    user: User;
    roles: RoleInDepartment[];
}
export interface DeleteFacultyUsers extends Action<ActionType> {
    type: ActionType.deleteFacultyUsers;
    id: number;
}
//#endregion

//#region Delete faculty actions
export interface DeleteFacultiesRequest extends Action<ActionType> {
    type: ActionType.deleteRequest;
    ids: number[];
}
export interface DeleteFacultiesSuccess extends Action<ActionType> {
    type: ActionType.deleteSuccess;
}
export interface DeleteFacultiesFailure extends Action<ActionType> {
    type: ActionType.deleteFailure;
    error: ApplicationError;
}
//#endregion

export interface ClearFacultyEditionState extends Action<ActionType> {
    type: ActionType.clearFacultyEditionState;
}

export interface ValidateFaculty extends Action<ActionType> {
    type: ActionType.validateFaculty;
    formErrors: DepartmentValidation;
}

export type GetFaculties = GetFacultiesRequest | GetFacultiesSuccess | GetFacultiesFailure;
export type GetFaculty = GetFacultyRequest | GetFacultySuccess | GetFacultyFailure;
export type UpdateFaculty = UpdateFacultyDetails | UpdateFacultyDepartments | DeleteFacultyDepartments;
export type SaveFaculty = SaveFacultyRequest | CreateFacultySuccess | UpdateFacultySuccess | SaveFacultyFailure;
export type UpdateFacultyUsersRoles = UpdateFacultyUsers | DeleteFacultyUsers;
export type DeleteFaculties = DeleteFacultiesRequest | DeleteFacultiesSuccess | DeleteFacultiesFailure;

export type FacultiesActions = GetFaculties
    | GetFaculty
    | UpdateFaculty
    | SaveFaculty
    | UpdateFacultyUsersRoles
    | DeleteFaculties
    | ClearFacultyEditionState
    | ValidateFaculty;
//#endregion

function getFaculties(options: FacultyGetOptions): AppThunkAction<Promise<GetFacultiesSuccess | GetFacultiesFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await departmentService.getFaculties(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: FacultyGetOptions): GetFacultiesRequest { return { type: ActionType.getFacultiesRequest, options: options }; }
        function success(faculties: Faculty[]): GetFacultiesSuccess { return { type: ActionType.getFacultiesSuccess, faculties: faculties }; }
        function failure(error: ApplicationError): GetFacultiesFailure { return { type: ActionType.getFacultiesFailure, error: error }; }
    }
}
function getFaculty(id?: number): AppThunkAction<Promise<GetFacultySuccess | GetFacultyFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id && id === NaN)
            return dispatch(success(Faculty.initial));

        const state = getState();
        let facultys: Faculty[] = [];

        try {
            if (state.facultyState.modelsLoading === true) {
                facultys = await departmentService.getFaculties({ id, type: DepartmentType.Faculty });
                if (!facultys) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти факультет', SnackbarVariant.warning));
                }
            } else {
                facultys = state.facultyState.models;
            }

            let faculty = facultys.find(o => o.id === id);
            dispatch(validateFaculty(faculty));
            return dispatch(success(faculty));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetFacultyRequest { return { type: ActionType.getFacultyRequest, id: id }; }
        function success(faculty: Faculty): GetFacultySuccess { return { type: ActionType.getFacultySuccess, faculty: faculty }; }
        function failure(error: ApplicationError): GetFacultyFailure { return { type: ActionType.getFacultyFailure, error: error }; }
    }
}
function updateFacultyDetails(model: Faculty): UpdateFacultyDetails {
    const formErrors = departmentService.validateDepartment(model);

    return { type: ActionType.updateFacultyDetails, faculty: model, formErrors: formErrors };
}
function updateFacultyUsers(user: User, roles: RoleInDepartment[]): UpdateFacultyUsers {
    return { type: ActionType.updateFacultyUsers, user: user, roles: roles };
}
function deleteFacultyUser(id: number): DeleteFacultyUsers {
    return { type: ActionType.deleteFacultyUsers, id: id };
}
function saveFaculty(model: Faculty): AppThunkAction<Promise<CreateFacultySuccess | UpdateFacultySuccess | SaveFacultyFailure>> {
    return async (dispatch) => {
        dispatch(request(model));

        try {
            if (model.id) {
                const result = await departmentService.update(model) as Faculty;
                dispatch(snackbarActions.showSnackbar('Факультет успешно сохранен', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await departmentService.create(model) as Faculty;
                dispatch(snackbarActions.showSnackbar('Факультет успешно сохранен', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(department: Faculty): SaveFacultyRequest { return { type: ActionType.saveRequest, department: department }; }
        function createSuccess(department: Faculty): CreateFacultySuccess { return { type: ActionType.createSuccess, department: department }; }
        function updateSuccess(department: Faculty): UpdateFacultySuccess { return { type: ActionType.updateSuccess, department: department }; }
        function failure(error: ApplicationError): SaveFacultyFailure { return { type: ActionType.saveFailure, error: error }; }
    }
}
function updateFacultyDepartments(departments: TrainingDepartment[]): UpdateFacultyDepartments {
    return { type: ActionType.updateFacultyDepartments, departments: departments };
}
function deleteFacultyDepartment(id: number): DeleteFacultyDepartments {
    return { type: ActionType.deleteFacultyDepartments, id: id };
}
function deleteFaculties(ids: number[]): AppThunkAction<Promise<DeleteFacultiesSuccess | DeleteFacultiesFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await departmentService.delete(ids);

            dispatch(snackbarActions.showSnackbar('Факультет успешно удален.', SnackbarVariant.info));
            return dispatch(success());
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteFacultiesRequest { return { type: ActionType.deleteRequest, ids: ids }; }
        function success(): DeleteFacultiesSuccess { return { type: ActionType.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteFacultiesFailure { return { type: ActionType.deleteFailure, error: error }; }
    }
}
function clearFacultyEditionState(): ClearFacultyEditionState {
    return { type: ActionType.clearFacultyEditionState };
}
function validateFaculty(model: Faculty): ValidateFaculty {
    const result = departmentService.validateFaculty(model);
    return { type: ActionType.validateFaculty, formErrors: result };
}

export default {
    getFaculties,
    getFaculty,
    updateFacultyDetails,
    updateFacultyUsers,
    deleteFacultyUser,
    saveFaculty,
    updateFacultyDepartments,
    deleteFacultyDepartment,
    deleteFaculties,
    clearFacultyEditionState,
    validateFaculty
}