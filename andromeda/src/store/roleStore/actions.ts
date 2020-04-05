import { Action } from "redux";
import { RoleGetOptions, Role, ApplicationError, RoleValidation, SnackbarVariant } from "../../models";
import { AppThunkAction, AppThunkDispatch, AppState } from "../../models/reduxModels";
import { roleService } from "../../services";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getRolesRequest = 'GET_ROLES_REQUEST',
    getRolesSuccess = 'GET_ROLES_SUCCESS',
    getRolesFailure = 'GET_ROLES_FAILURE',

    getRequest = 'GET_REQUEST',
    getSuccess = 'GET_SUCCESS',
    getFailure = 'GET_FAILURE',

    saveRequest = 'SAVE_ROLE_REQUEST',
    createSuccess = 'CREATE_ROLE_SUCCESS',
    updateSuccess = 'UPDATE_ROLE_SUCCESS',
    saveFailure = 'SAVE_ROLE_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_ROLE_REQUEST',
    deleteSuccess = 'DELETE_ROLE_SUCCESS',
    deleteFailure = 'DELETE_ROLE_FAILURE',

    validate = 'VALIDATE_ROLE'
}
//#endregion


//#region Actions types interfaces
export interface GetRolesRequest extends Action<ActionType> {
    type: ActionType.getRolesRequest;
    options: RoleGetOptions;
}

export interface GetRolesSuccess extends Action<ActionType> {
    type: ActionType.getRolesSuccess;
    roles: Role[];
}

export interface GetRolesFailure extends Action<ActionType> {
    type: ActionType.getRolesFailure;
    error: ApplicationError;
}

export interface GetRequest extends Action<ActionType> {
    type: ActionType.getRequest;
    id?: number;
}

export interface GetSuccess extends Action<ActionType> {
    type: ActionType.getSuccess;
    role: Role;
}

export interface GetFailure extends Action<ActionType> {
    type: ActionType.getFailure;
    error: ApplicationError;
}

export interface SaveRequest extends Action<ActionType> {
    type: ActionType.saveRequest;
    role: Role;
}

export interface CreateSuccess extends Action<ActionType> {
    type: ActionType.createSuccess;
    role: Role;
}

export interface UpdateSuccess extends Action<ActionType> {
    type: ActionType.updateSuccess;
    role: Role;
}

export interface SaveFailure extends Action<ActionType> {
    type: ActionType.saveFailure;
    error: ApplicationError;
}

export interface ClearEditionState extends Action<ActionType> {
    type: ActionType.clearEditionState;
}

export interface DeleteRequest extends Action<ActionType> {
    type: ActionType.deleteRequest;
    ids: number[];
}

export interface DeleteSuccess extends Action<ActionType> {
    type: ActionType.deleteSuccess;
}

export interface DeleteFailure extends Action<ActionType> {
    type: ActionType.deleteFailure;
    error: ApplicationError;
}

export interface Validate extends Action<ActionType> {
    type: ActionType.validate;
    formErrors: RoleValidation;
}

export type GetRoles = GetRolesRequest | GetRolesSuccess | GetRolesFailure;
export type GetRole = GetRequest | GetSuccess | GetFailure
export type SaveRole = SaveRequest | CreateSuccess | UpdateSuccess | SaveFailure;
export type DeleteRole = DeleteRequest | DeleteSuccess | DeleteFailure;

export type RoleActions = GetRoles | GetRole | ClearEditionState | SaveRole | DeleteRole | Validate;
//#endregion

//#region Actions
function saveRole(role: Role): AppThunkAction<Promise<CreateSuccess | UpdateSuccess | SaveFailure>> {
    return async (dispatch) => {
        dispatch(request(role));

        try {
            if (role.id) {
                const result = await roleService.update(role);
                dispatch(snackbarActions.showSnackbar('Роль успешно сохранена', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await roleService.create(role);
                dispatch(snackbarActions.showSnackbar('Роль успешно сохранена', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(role: Role): SaveRequest { return { type: ActionType.saveRequest, role: role }; }
        function createSuccess(role: Role): CreateSuccess { return { type: ActionType.createSuccess, role: role }; }
        function updateSuccess(role: Role): UpdateSuccess { return { type: ActionType.updateSuccess, role: role }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionType.saveFailure, error: error }; }
    }
}

function clearEditionState(): ClearEditionState {
    return { type: ActionType.clearEditionState };
}

function getRoles(options: RoleGetOptions): AppThunkAction<Promise<GetRolesSuccess | GetRolesFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await roleService.getRoles(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: RoleGetOptions): GetRolesRequest { return { type: ActionType.getRolesRequest, options: options }; }
        function success(roles: Role[]): GetRolesSuccess { return { type: ActionType.getRolesSuccess, roles: roles }; }
        function failure(error: ApplicationError): GetRolesFailure { return { type: ActionType.getRolesFailure, error: error }; }
    }
}

function getRole(id?: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch: AppThunkDispatch<Promise<GetSuccess | GetFailure>>, getState: () => AppState) => {
        dispatch(request(id));

        if (!id && id !== 0)
            return dispatch(success(Role.initial));

        const state = getState();
        let roles: Role[] = [];

        try {
            if (state.roleState.loading === true) {
                roles = await roleService.getRoles({ id });
                if (!roles) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти роли', SnackbarVariant.warning));
                }
            } else {
                roles = state.roleState.roles;
            }

            let role = roles.find(o => o.id === id);
            return dispatch(success(role));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionType.getRequest, id: id }; }
        function success(role: Role): GetSuccess { return { type: ActionType.getSuccess, role: role }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionType.getFailure, error: error }; }
    }
}

function deleteRoles(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await roleService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Роль успешно удалена.', SnackbarVariant.success));
            return dispatch(success());
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteRequest { return { type: ActionType.deleteRequest, ids: ids }; }
        function success(): DeleteSuccess { return { type: ActionType.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteFailure { return { type: ActionType.deleteFailure, error: error }; }
    }
}

function validateRole(role: Role): Validate {
    const result = roleService.validateRole(role);
    return { type: ActionType.validate, formErrors: result };
}

export default {
    saveRole,
    clearEditionState,
    getRoles,
    getRole,
    deleteRoles,
    validateRole
}
//#endregion