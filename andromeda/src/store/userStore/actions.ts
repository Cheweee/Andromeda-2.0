import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { User, ApplicationError, AuthenticatedUser, UserGetOptions, UserAuthenticateOptions, UserValidation } from "../../models";
import { userService } from "../../services";
import { AppState } from "../createStore";

//#region Actions types enum
export enum ActionType {
    signinRequest = 'SIGN_IN_REQUEST',
    signinSuccess = 'SIGN_IN_SUCCESS',
    signinFailure = 'SIGN_IN_FAILURE',

    signOut = 'SIGN_OUT',

    getRequest = 'GET_USERS_REQUEST',
    getSuccess = 'GET_USERS_SUCCESS',
    getFailure = 'GET_USERS_FAILURE',

    createRequest = 'CREATE_USER_REQUEST',
    createSuccess = 'CREATE_USER_SUCCESS',
    createFailure = 'CREATE_USER_FAILURE',

    updateRequest = 'UPDATE_USER_REQUEST',
    updateSuccess = 'UPDATE_USER_SUCCESS',
    updateFailure = 'UPDATE_USER_FAILURE',

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

export interface GetRequest extends Action<ActionType> {
    type: ActionType.getRequest;
    options: UserGetOptions;
}

export interface GetSuccess extends Action<ActionType> {
    type: ActionType.getSuccess;
    users: User[];
}

export interface GetFailure extends Action<ActionType> {
    type: ActionType.getFailure;
    error: ApplicationError;
}

export interface CreateRequest extends Action<ActionType> {
    type: ActionType.createRequest;
    user: User;
}

export interface CreateSuccess extends Action<ActionType> {
    type: ActionType.createSuccess;
    user: User;
}

export interface CreateFailure extends Action<ActionType> {
    type: ActionType.createFailure;
    error: ApplicationError;
}

export interface UpdateRequest extends Action<ActionType> {
    type: ActionType.updateRequest;
    user: User;
}

export interface UpdateSuccess extends Action<ActionType> {
    type: ActionType.updateSuccess;
    user: User;
}

export interface UpdateFailure extends Action<ActionType> {
    type: ActionType.updateFailure;
    error: ApplicationError;
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
export type GetUsers = GetRequest | GetSuccess | GetFailure;
export type CreateUser = CreateRequest | CreateSuccess | CreateFailure;
export type UpdateUser = UpdateRequest | UpdateSuccess | UpdateFailure;
export type DeleteUser = DeleteRequest | DeleteSuccess | DeleteFailure;

export type UserActions = Signin | Signout | GetUsers | CreateUser | UpdateUser | DeleteUser | ValidateCredentials | Validate;
//#endregion

//#region Actions
function signin(options: UserAuthenticateOptions): ThunkAction<Promise<SigninSuccess | SigninFailure>, AppState, void, Action> {
    return async (dispatch) => {
        dispatch(request(options));

        try {
            const result = await userService.signin(options);
            return dispatch(success(result));
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

function createUser(user: User): ThunkAction<Promise<CreateSuccess | CreateFailure>, AppState, void, Action> {
    return async (dispatch) => {
        dispatch(request(user));

        try {
            const result = await userService.create(user);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                return dispatch(failure(error));
        }

        function request(user: User): CreateRequest { return { type: ActionType.createRequest, user: user }; }
        function success(user: User): CreateSuccess { return { type: ActionType.createSuccess, user: user }; }
        function failure(error: ApplicationError): CreateFailure { return { type: ActionType.createFailure, error: error }; }
    }
}

function getUsers(options: UserGetOptions): ThunkAction<Promise<GetSuccess | GetFailure>, AppState, void, Action> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await userService.get(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                return dispatch(failure(error));
        }

        function request(options: UserGetOptions): GetRequest { return { type: ActionType.getRequest, options: options }; }
        function success(users: User[]): GetSuccess { return { type: ActionType.getSuccess, users: users }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionType.getFailure, error: error }; }
    }
}

function updateUser(user: User): ThunkAction<Promise<UpdateSuccess | UpdateFailure>, AppState, void, Action> {
    return async (dispatch) => {
        dispatch(request(user));

        try {
            const result = await userService.update(user);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                return dispatch(failure(error));
        }

        function request(user: User): UpdateRequest { return { type: ActionType.updateRequest, user: user }; }
        function success(user: User): UpdateSuccess { return { type: ActionType.updateSuccess, user: user }; }
        function failure(error: ApplicationError): UpdateFailure { return { type: ActionType.updateFailure, error: error }; }
    }
}

function deleteUsers(ids: number[]): ThunkAction<Promise<DeleteSuccess | DeleteFailure>, AppState, void, Action> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await userService.delete(ids);
            return dispatch(success());
        }
        catch (error) {
            if (error instanceof ApplicationError)
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

export interface UserActionsProps {
    signin: (options: UserAuthenticateOptions) => Promise<SigninSuccess | SigninFailure>;
    signout: () => Signout;
    createUser: (user: User) => Promise<CreateSuccess | CreateFailure>;
    getUsers: (options: UserGetOptions) => Promise<GetSuccess | GetFailure>;
    updateUser: (user: User) => Promise<UpdateSuccess | UpdateFailure>;
    deleteUsers: (ids: number[]) => Promise<DeleteSuccess | DeleteFailure>;
    validateCredentials: (username: string, password: string) => ValidateCredentials;
    validateUser: (user: User) => Validate;
}

export default {
    signin,
    signout,
    createUser,
    getUsers,
    updateUser,
    deleteUsers,
    validateCredentials,
    validateUser
}
//#endregion