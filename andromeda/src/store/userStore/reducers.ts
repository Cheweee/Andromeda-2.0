import { UserState, UsersListState, AuthenticationState, UsersDeleteState, UserValidating, UserGetState } from "./state";
import { UserActions, ActionType } from "./actions";
import { UserValidation } from "../../models";

const initialState: UserState = {
    authenticating: false,
    loading: true,
    deleting: false,
    userLoading: true,

    formErrors: UserValidation.initial
}

export function userReducer(prevState: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case ActionType.signinRequest: {
            const state: AuthenticationState = { authenticating: true, options: action.options };
            return { ...prevState, ...state };
        }
        case ActionType.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionType.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionType.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionType.getRequest: {
            const state: UserGetState = { userLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getSuccess: {
            const state: UserGetState = { userLoading: false, user: action.user };
            return { ...prevState, ...state };
        }
        case ActionType.getFailure: {
            const state: UserGetState = { userLoading: false, user: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getUsersRequest: {
            const state: UsersListState = { loading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersSuccess: {
            const state: UsersListState = { loading: false, users: action.users };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersFailure: {
            const state: UsersListState = { loading: false, users: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.loading === false) {
                const state: UsersListState = { loading: false, users: prevState.users.concat(action.user) };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.updateSuccess: {
            if (prevState.loading === false) {
                const updated = prevState.users.map(o => o.id == action.user.id ? action.user : o);
                const state: UsersListState = { loading: false, users: updated };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.saveFailure: return prevState;


        case ActionType.deleteRequest: {
            const deleteState: UsersDeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.loading === false) {
                const state: UsersListState = { loading: false, users: prevState.users.filter((value) => !prevState.ids.includes(value.id)) };
                const deleteState: UsersDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionType.deleteFailure: {
            const deleteState: UsersDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.validate: {
            const state: UserValidating = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.validateCredentials: {
            const state: UserValidating = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.clearEditionState: {
            const state: UserGetState = { userLoading: true, user: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}