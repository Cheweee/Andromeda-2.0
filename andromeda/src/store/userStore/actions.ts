import { Action } from "redux";

import { User, ApplicationError, AuthenticatedUser, UserGetOptions, UserAuthenticateOptions, UserValidation, SnackbarVariant, PinnedDiscipline, ProjectType, DisciplineTitle, GraduateDegree, BranchOfScience } from "../../models";
import { userService, sessionService } from "../../services";
import { AppThunkAction, AppState, AppThunkDispatch } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    signinRequest = 'SIGN_IN_REQUEST',
    signinSuccess = 'SIGN_IN_SUCCESS',
    signinFailure = 'SIGN_IN_FAILURE',

    signOut = 'SIGN_OUT',

    getUsersRequest = 'GET_USERS_REQUEST',
    getUsersSuccess = 'GET_USERS_SUCCESS',
    getUsersFailure = 'GET_USERS_FAILURE',

    getUserRequest = 'GET_USER_REQUEST',
    getUserSuccess = 'GET_USER_SUCCESS',
    getUserFailure = 'GET_USER_FAILURE',

    updateUserDetails = 'UPDATE_USER_DETAILS',
    updateUserPinnedDisciplines = 'UPDATE_USER_PINNED_DISCIPLINES',
    deleteUserPinnedDiscipline = 'DELETE_USER_PINNED_DISCIPLINE',
    updateGraduateDegrees = 'UPDATE_USER_GRADUATE_DEGREE',
    deleteGraduateDegree = 'DELETE_USER_GRADUATE_DEGREE',

    saveRequest = 'SAVE_USER_REQUEST',
    createSuccess = 'CREATE_USER_SUCCESS',
    updateSuccess = 'UPDATE_USER_SUCCESS',
    saveFailure = 'SAVE_USER_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_USER_REQUEST',
    deleteSuccess = 'DELETE_USER_SUCCESS',
    deleteFailure = 'DELETE_USER_FAILURE',

    validateCredentials = 'VALIDATE_USER_CREDENTIALS',
    validate = 'VALIDATE_USER'
}
//#endregion

//#region Actions types interfaces
export interface SigninRequest extends Action<ActionType> {
    type: ActionType.signinRequest;
    options: UserAuthenticateOptions;
}

export interface SigninSuccess extends Action<ActionType> {
    type: ActionType.signinSuccess;
    user: AuthenticatedUser;
}

export interface SigninFailure extends Action<ActionType> {
    type: ActionType.signinFailure;
    error: ApplicationError;
}

export interface Signout extends Action<ActionType> {
    type: ActionType.signOut;
}

export interface GetUsersRequest extends Action<ActionType> {
    type: ActionType.getUsersRequest;
    options: UserGetOptions;
}

export interface GetUsersSuccess extends Action<ActionType> {
    type: ActionType.getUsersSuccess;
    users: User[];
}

export interface GetUsersFailure extends Action<ActionType> {
    type: ActionType.getUsersFailure;
    error: ApplicationError;
}

export interface GetRequest extends Action<ActionType> {
    type: ActionType.getUserRequest;
    id?: number;
}

export interface GetSuccess extends Action<ActionType> {
    type: ActionType.getUserSuccess;
    user: User;
}

export interface GetFailure extends Action<ActionType> {
    type: ActionType.getUserFailure;
    error: ApplicationError;
}

export interface UpdateUserDetails extends Action<ActionType> {
    type: ActionType.updateUserDetails;
    user: User;
    formErrors: UserValidation;
}

export interface UpdateUserPinnedDisciplines extends Action<ActionType> {
    type: ActionType.updateUserPinnedDisciplines;
    disciplineTitle: DisciplineTitle;
    projectTypes: ProjectType[];
}

export interface DeleteUserPinnedDisciplines extends Action<ActionType> {
    type: ActionType.deleteUserPinnedDiscipline;
    id: number;
}

export interface UpdateGraduateDegrees extends Action<ActionType> {
    type: ActionType.updateGraduateDegrees;
    graduateDegree: GraduateDegree;
    branchOfScience: BranchOfScience;
}

export interface DeleteGraduateDegree extends Action<ActionType> {
    type: ActionType.deleteGraduateDegree;
    branchOfScience: BranchOfScience;
}

export interface SaveRequest extends Action<ActionType> {
    type: ActionType.saveRequest;
    user: User;
}

export interface CreateSuccess extends Action<ActionType> {
    type: ActionType.createSuccess;
    user: User;
}

export interface UpdateSuccess extends Action<ActionType> {
    type: ActionType.updateSuccess;
    user: User;
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

export interface ValidateCredentials extends Action<ActionType> {
    type: ActionType.validateCredentials;
    formErrors: UserValidation;
}

export interface Validate extends Action<ActionType> {
    type: ActionType.validate;
    formErrors: UserValidation;
}

export type Signin = SigninRequest | SigninSuccess | SigninFailure;
export type GetUsers = GetUsersRequest | GetUsersSuccess | GetUsersFailure;
export type GetUser = GetRequest | GetSuccess | GetFailure
export type SaveUser = SaveRequest | CreateSuccess | UpdateSuccess | SaveFailure;
export type UpdateSelectedUser = UpdateUserDetails
    | UpdateUserPinnedDisciplines
    | DeleteUserPinnedDisciplines
    | UpdateGraduateDegrees
    | DeleteGraduateDegree;
export type DeleteUser = DeleteRequest | DeleteSuccess | DeleteFailure;

export type UserActions = Signin
    | Signout
    | GetUsers
    | GetUser
    | ClearEditionState
    | SaveUser
    | DeleteUser
    | UpdateSelectedUser
    | ValidateCredentials
    | Validate;
//#endregion

//#region Actions
function signin(options: UserAuthenticateOptions): AppThunkAction<Promise<SigninSuccess | SigninFailure>> {
    return async (dispatch) => {
        dispatch(request(options));

        try {
            const result = await userService.signin(options);
            if (result && result.token && sessionService.signIn(result.token)) {
                return dispatch(success(result));
            } else {
                const error: ApplicationError = new ApplicationError('Неправильное имя пользователя или пароль');
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                return dispatch(failure(error));
        }

        function request(options: UserAuthenticateOptions): SigninRequest { return { type: ActionType.signinRequest, options: options }; }
        function success(user: AuthenticatedUser): SigninSuccess { return { type: ActionType.signinSuccess, user: user }; }
        function failure(error: ApplicationError): SigninFailure { return { type: ActionType.signinFailure, error: error }; }
    }
}

function signout(): Signout {
    userService.signout();
    return { type: ActionType.signOut };
}

function saveUser(user: User): AppThunkAction<Promise<CreateSuccess | UpdateSuccess | SaveFailure>> {
    return async (dispatch) => {
        dispatch(request(user));

        try {
            if (user.id) {
                const result = await userService.update(user);
                dispatch(snackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await userService.create(user);
                dispatch(snackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(user: User): SaveRequest { return { type: ActionType.saveRequest, user: user }; }
        function createSuccess(user: User): CreateSuccess { return { type: ActionType.createSuccess, user: user }; }
        function updateSuccess(user: User): UpdateSuccess { return { type: ActionType.updateSuccess, user: user }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionType.saveFailure, error: error }; }
    }
}

function clearEditionState(): ClearEditionState {
    return { type: ActionType.clearEditionState };
}

function getUsers(options: UserGetOptions): AppThunkAction<Promise<GetUsersSuccess | GetUsersFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await userService.get(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: UserGetOptions): GetUsersRequest { return { type: ActionType.getUsersRequest, options: options }; }
        function success(users: User[]): GetUsersSuccess { return { type: ActionType.getUsersSuccess, users: users }; }
        function failure(error: ApplicationError): GetUsersFailure { return { type: ActionType.getUsersFailure, error: error }; }
    }
}

function getUser(id?: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id || id === NaN)
            return dispatch(success(User.initial));

        const state = getState();
        let users: User[] = [];

        try {
            if (state.userState.modelsLoading === true) {
                users = await userService.get({ id });
                if (!users) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти пользователя', SnackbarVariant.warning));
                }
            } else {
                users = state.userState.models;
            }

            let user = users.find(o => o.id === id);
            dispatch(validateUser(user));
            return dispatch(success(user));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionType.getUserRequest, id: id }; }
        function success(user: User): GetSuccess { return { type: ActionType.getUserSuccess, user: user }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionType.getUserFailure, error: error }; }
    }
}

function updateUserDetails(user: User): UpdateUserDetails {
    const formErrors = userService.validateUser(user);

    return { type: ActionType.updateUserDetails, user: user, formErrors: formErrors };
}

function updateUserPinnedDisciplines(disciplineTitle: DisciplineTitle, projectTypes: ProjectType[]): UpdateUserPinnedDisciplines {
    return { type: ActionType.updateUserPinnedDisciplines, disciplineTitle: disciplineTitle, projectTypes: projectTypes };
}

function deleteUserPinnedDiscipline(id: number): DeleteUserPinnedDisciplines {
    return { type: ActionType.deleteUserPinnedDiscipline, id: id };
}

function updateGraduateDegrees(graduateDegree: GraduateDegree, branchOfScience: BranchOfScience): UpdateGraduateDegrees {
    return { type: ActionType.updateGraduateDegrees, graduateDegree, branchOfScience };
}

function deleteGraduateDegree(branchOfScience: BranchOfScience): DeleteGraduateDegree {
    return { type: ActionType.deleteGraduateDegree, branchOfScience };
}

function deleteUsers(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await userService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
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

function validateCredentials(username: string, password: string): ValidateCredentials {
    const result = userService.validateCredentials(username, password);
    return { type: ActionType.validateCredentials, formErrors: result };
}

function validateUser(user: User): Validate {
    const result = userService.validateUser(user);
    return { type: ActionType.validate, formErrors: result };
}

export default {
    signin,
    signout,
    saveUser,
    updateUserDetails,
    updateUserPinnedDisciplines,
    deleteUserPinnedDiscipline,
    updateGraduateDegrees,
    deleteGraduateDegree,
    clearEditionState,
    getUsers,
    getUser,
    deleteUsers,
    validateCredentials,
    validateUser
}
//#endregion