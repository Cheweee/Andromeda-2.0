import { Action } from "redux";
import {
    DepartmentGetOptions,
    Department,
    DepartmentValidation,
    ApplicationError,
    AppThunkAction,
    SnackbarVariant} from "../../models";
import { departmentService } from "../../services";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getDepartmentsRequest = 'GET_DEPARTMENT_REQUEST',
    getDepartmentsSuccess = 'GET_DEPARTMENT_SUCCESS',
    getDepartmentsFailure = 'GET_DEPARTMENT_FAILURE',

    updateDepartmentUsers = 'UPDATE_DEPARTMENT_USERS',
    deleteDepartmentUsers = 'DELETE_DEPARTMENT_USERS',

    saveRequest = 'SAVE_DEPARTMENT_REQUEST',
    createSuccess = 'CREATE_DEPARTMENT_SUCCESS',
    updateSuccess = 'UPDATE_DEPARTMENT_SUCCESS',
    saveFailure = 'SAVE_DEPARTMENT_FAILURE',

    clearDepartmentEditionState = 'CLEAR_DEPARTMENT_EDITION_STATE',

    validateDepartment = 'VALIDATE_DEPARTMENT',

    deleteRequest = 'DELETE_DEPARTMENT_REQUEST',
    deleteSuccess = 'DELETE_DEPARTMENT_SUCCESS',
    deleteFailure = 'DELETE_DEPARTMENT_FAILURE',
}
//#endregion

//#region Actions types interfaces
//#region Get departments actions
export interface GetDepartmentsRequest extends Action<ActionType> {
    type: ActionType.getDepartmentsRequest;
    options: DepartmentGetOptions;
}
export interface GetDepartmentsSuccess extends Action<ActionType> {
    type: ActionType.getDepartmentsSuccess;
    departments: Department[];
}
export interface GetDepartmentsFailure extends Action<ActionType> {
    type: ActionType.getDepartmentsFailure;
    error: ApplicationError;
}
//#endregion

export interface ValidateFaculty extends Action<ActionType> {
    type: ActionType.validateDepartment;
    formErrors: DepartmentValidation;
}
export type GetDepartments = GetDepartmentsRequest | GetDepartmentsSuccess | GetDepartmentsFailure;

export type DepartmentActions = GetDepartments | ValidateFaculty;
//#endregion

//#region Actions
function getDepartments(options: DepartmentGetOptions): AppThunkAction<Promise<GetDepartmentsSuccess | GetDepartmentsFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await departmentService.getDepartments(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: DepartmentGetOptions): GetDepartmentsRequest { return { type: ActionType.getDepartmentsRequest, options: options }; }
        function success(departments: Department[]): GetDepartmentsSuccess { return { type: ActionType.getDepartmentsSuccess, departments: departments }; }
        function failure(error: ApplicationError): GetDepartmentsFailure { return { type: ActionType.getDepartmentsFailure, error: error }; }
    }
}

export default {
    getDepartments
}
//#endregion