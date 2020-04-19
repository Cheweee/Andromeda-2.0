import { Action } from "redux";
import { DepartmentLoadGetOptions, DepartmentLoad, ApplicationError, AppThunkAction, AppThunkDispatch, SnackbarVariant, AppState, DepartmentLoadImportOptions, GroupDisciplineLoad, UserDisciplineLoad } from "../../models";
import { departmentLoadService } from "../../services/departmentLoadService";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getModelsRequest = 'GET_DEPARTMENT_LOADS_REQUEST',
    getModelsSuccess = 'GET_DEPARTMENT_LOADS_SUCCESS',
    getModelsFailure = 'GET_DEPARTMENT_LOADS_FAILURE',

    getModelRequest = 'GET_DEPARTMENT_LOAD_REQUEST',
    getModelSuccess = 'GET_DEPARTMENT_LOAD_SUCCESS',
    getModelFailure = 'GET_DEPARTMENT_LOAD_FAILURE',

    saveRequest = 'SAVE_DEPARTMENT_LOAD_REQUEST',
    createSuccess = 'CREATE_DEPARTMENT_LOAD_SUCCESS',
    updateSuccess = 'UPDATE_DEPARTMENT_LOAD_SUCCESS',
    saveFailure = 'SAVE_DEPARTMENT_LOAD_FAILURE',

    deleteRequest = 'DELETE_DEPARTMENT_LOAD_REQUEST',
    deleteSuccess = 'DELETE_DEPARTMENT_LOAD_SUCCESS',
    deleteFailure = 'DELETE_DEPARTMENT_LOAD_FAILURE',

    clearEditionState = 'CLEAR_DEPARTMENT_LOAD_EDITION_STATE',

    validate = 'VALIDATE_DEPARTMENT_LOAD',

    importRequest = 'IMPORT_DEPARTMENT_LOAD_REQUEST',
    importSuccess = 'IMPORT_DEPARTMENT_LOAD_SUCCESS',
    importFailure = 'IMPORT_DEPARTMENT_LOAD_FAILURE',

    generateRequest = 'GENERATE_DEPARTMENT_LOAD_REQUEST',
    generateSuccess = 'GENERATE_DEPARTMENT_LOAD_SUCCESS',
    generateFailure = 'GENERATE_DEPARTMENT_LOAD_FAILURE',

    updateDetails = 'UPDATE_DEPARTMENT_LOAD_DETAILS',
    updateGroupDisciplineLoad = 'UPDATE_GROUP_DISCIPLINE_LOAD',
    deleteGroupDisciplineLoad = 'DELETE_GROUP_DISCIPLINE_LOAD',
    updateUserDiscplineLoad = 'UPDATE_USER_DISCIPLINE_LOAD',
    deleteUserDisciplineLoad = 'DELETE_USER_DISCIPLINE_LOAD'
}
//#endregion

//#region Actions types interfaces
//#region Get models actions
export interface GetModelsRequest extends Action<ActionType> {
    type: ActionType.getModelsRequest;
    options: DepartmentLoadGetOptions;
}
export interface GetModelsSuccess extends Action<ActionType> {
    type: ActionType.getModelsSuccess;
    models: DepartmentLoad[];
}
export interface GetModelsFailure extends Action<ActionType> {
    type: ActionType.getModelsFailure;
    error: ApplicationError;
}
//#endregion

//#region Get model actions
export interface GetModelRequest extends Action<ActionType> {
    type: ActionType.getModelRequest;
    id?: number;
}
export interface GetModelSuccess extends Action<ActionType> {
    type: ActionType.getModelSuccess;
    model: DepartmentLoad;
}
export interface GetModelFailure extends Action<ActionType> {
    type: ActionType.getModelFailure;
    error: ApplicationError;
}
//#endregion

//#region Save actions
export interface SaveRequest extends Action<ActionType> {
    type: ActionType.saveRequest;
    model: DepartmentLoad;
}
export interface CreateSuccess extends Action<ActionType> {
    type: ActionType.createSuccess;
    model: DepartmentLoad;
}
export interface UpdateSuccess extends Action<ActionType> {
    type: ActionType.updateSuccess;
    model: DepartmentLoad;
}
export interface SaveFailure extends Action<ActionType> {
    type: ActionType.saveFailure;
    error: ApplicationError;
}
//#endregion

//#region Delete actions
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
//#endregion

export interface ClearEditionState extends Action<ActionType> {
    type: ActionType.clearEditionState;
}

// TODO: Реализовать валидацию нагрузки кафедры
// export interface ValidateModel extends Action<ActionType> {
//     type: ActionType.validate;
//     formErrors: DepartmentLoadValidation;
// }

//#region Import actions
export interface ImportRequest extends Action<ActionType> {
    type: ActionType.importRequest;
}
export interface ImportSuccess extends Action<ActionType> {
    type: ActionType.importSuccess;
    model: DepartmentLoad;
}
export interface ImportFailure extends Action<ActionType> {
    type: ActionType.importFailure;
    error: ApplicationError;
}
//#endregion

//#region Generate actions
export interface GenerateRequest extends Action<ActionType> {
    type: ActionType.generateRequest;
}
export interface GenerateSuccess extends Action<ActionType> {
    type: ActionType.generateSuccess;
    model: DepartmentLoad;
}
export interface GenerateFailure extends Action<ActionType> {
    type: ActionType.generateFailure;
    error: ApplicationError;
}
//#endregion

export interface UpdateDetails extends Action<ActionType> {
    type: ActionType.updateDetails;
    model: DepartmentLoad;
}

export interface UpdateGroupDisciplineLoad extends Action<ActionType> {
    type: ActionType.updateGroupDisciplineLoad;
    index: number;
    groupDisciplineLoad: GroupDisciplineLoad;
}
export interface DeleteGroupDisciplineLoad extends Action<ActionType> {
    type: ActionType.deleteGroupDisciplineLoad;
    index: number;
}

export interface UpdateUserDisciplineLoad extends Action<ActionType> {
    type: ActionType.updateUserDiscplineLoad;
    groupDisciplineLoadIndex: number;
    userDisciplineLoad: UserDisciplineLoad;
}
export interface DeleteUserDisciplineLoad extends Action<ActionType> {
    type: ActionType.deleteUserDisciplineLoad;
    userId: number;
}

export type GetModels = GetModelsRequest | GetModelsSuccess | GetModelsFailure;
export type GetModel = GetModelRequest | GetModelSuccess | GetModelFailure;
export type Save = SaveRequest | CreateSuccess | UpdateSuccess | SaveFailure;
export type Delete = DeleteRequest | DeleteSuccess | DeleteFailure;

export type Import = ImportRequest | ImportSuccess | ImportFailure;
export type Generate = GenerateRequest | GenerateSuccess | GenerateFailure;
export type Update = UpdateDetails | UpdateGroupDisciplineLoad | DeleteGroupDisciplineLoad | UpdateUserDisciplineLoad | DeleteUserDisciplineLoad;

export type DepartmentLoadActions = GetModels | GetModel | Save | Delete | ClearEditionState | Import | Generate | Update;
//#endregion

function getModels(options: DepartmentLoadGetOptions): AppThunkAction<Promise<GetModelsSuccess | GetModelsFailure>> {
    return async (dispatch: AppThunkDispatch) => {
        dispatch(request(options));

        try {
            const result = await departmentLoadService.getDepartmentLoads(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: DepartmentLoadGetOptions): GetModelsRequest { return { type: ActionType.getModelsRequest, options: options } }
        function success(models: DepartmentLoad[]): GetModelsSuccess { return { type: ActionType.getModelsSuccess, models: models }; }
        function failure(error: ApplicationError): GetModelsFailure { return { type: ActionType.getModelsFailure, error: error }; }
    }
}
function getModel(id?: number): AppThunkAction<Promise<GetModelSuccess | GetModelFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id && id === NaN)
            return dispatch(success(DepartmentLoad.initial));

        const state = getState();
        let models: DepartmentLoad[] = [];

        try {
            if (state.departmentLoadState.modelsLoading === true) {
                models = await departmentLoadService.getDepartmentLoads({ id });
                if (!models) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти факультет', SnackbarVariant.warning));
                }
            } else {
                models = state.departmentLoadState.models;
            }

            let model = models.find(o => o.id === id);
            //dispatch(validateFaculty(model));
            return dispatch(success(model));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetModelRequest { return { type: ActionType.getModelRequest, id: id }; }
        function success(model: DepartmentLoad): GetModelSuccess { return { type: ActionType.getModelSuccess, model: model }; }
        function failure(error: ApplicationError): GetModelFailure { return { type: ActionType.getModelFailure, error: error }; }
    }
}
function save(model: DepartmentLoad): AppThunkAction<Promise<CreateSuccess | UpdateSuccess | SaveFailure>> {
    return async (dispatch: AppThunkDispatch) => {
        dispatch(request(model));

        try {
            if (model.id) {
                const result = await departmentLoadService.update(model);
                dispatch(snackbarActions.showSnackbar('Нагрузка кафедры успешно сохранена', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await departmentLoadService.create(model);
                dispatch(snackbarActions.showSnackbar('Нагрузка кафедры успешно сохранена', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(model: DepartmentLoad): SaveRequest { return { type: ActionType.saveRequest, model: model }; }
        function createSuccess(model: DepartmentLoad): CreateSuccess { return { type: ActionType.createSuccess, model: model }; }
        function updateSuccess(model: DepartmentLoad): UpdateSuccess { return { type: ActionType.updateSuccess, model: model }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionType.saveFailure, error: error }; }
    }
}
function deleteModels(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch: AppThunkDispatch) => {
        dispatch(request(ids));

        try {
            await departmentLoadService.delete(ids);

            dispatch(snackbarActions.showSnackbar('Нагрузка кафедры успешно удалена.', SnackbarVariant.success));
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
function clearEditionState(): ClearEditionState {
    return { type: ActionType.clearEditionState };
}
function importDepartmentLoad(options: DepartmentLoadImportOptions): AppThunkAction<Promise<ImportSuccess | ImportFailure>> {
    return async (dispatch: AppThunkDispatch) => {
        dispatch(request());

        try {
            const result = await departmentLoadService.import(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(): ImportRequest { return { type: ActionType.importRequest }; }
        function success(model: DepartmentLoad): ImportSuccess { return { type: ActionType.importSuccess, model: model }; }
        function failure(error: ApplicationError): ImportFailure { return { type: ActionType.importFailure, error: error }; }
    }
}
function generate(model: DepartmentLoad): AppThunkAction<Promise<GenerateSuccess | GenerateFailure>> {
    return async (dispatch: AppThunkDispatch) => {
        dispatch(request);

        try {
            const result = await departmentLoadService.generate(model);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(): GenerateRequest { return { type: ActionType.generateRequest }; }
        function success(model: DepartmentLoad): GenerateSuccess { return { type: ActionType.generateSuccess, model: model }; }
        function failure(error: ApplicationError): GenerateFailure { return { type: ActionType.generateFailure, error: error }; }
    }
}
function updateDetails(model: DepartmentLoad): UpdateDetails {
    return { type: ActionType.updateDetails, model: model };
}
function updateGroupDisciplineLoad(index: number, groupDisciplineLoad: GroupDisciplineLoad): UpdateGroupDisciplineLoad {
    return { type: ActionType.updateGroupDisciplineLoad, index: index, groupDisciplineLoad: groupDisciplineLoad };
}
function deleteGroupDisciplineLoad(index: number): DeleteGroupDisciplineLoad {
    return { type: ActionType.deleteGroupDisciplineLoad, index: index };
}
function updateUserDisciplineLoad(groupDisciplineLoadIndex: number, userDisciplineLoad: UserDisciplineLoad): UpdateUserDisciplineLoad {
    return { type: ActionType.updateUserDiscplineLoad, groupDisciplineLoadIndex: groupDisciplineLoadIndex, userDisciplineLoad: userDisciplineLoad };
}
function deleteUserDisciplineLoad(userId: number): DeleteUserDisciplineLoad {
    return { type: ActionType.deleteUserDisciplineLoad, userId: userId };
}

export default {
    getModels,
    getModel,
    save,
    deleteModels,
    clearEditionState,
    importDepartmentLoad,
    generate,
    updateDetails,
    updateGroupDisciplineLoad,
    deleteGroupDisciplineLoad,
    updateUserDisciplineLoad,
    deleteUserDisciplineLoad
}