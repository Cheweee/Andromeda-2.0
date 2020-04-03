import { UserState, UsersListState, AuthenticationState, UsersDeleteState } from "./state";
import { UserActions, ActionType } from "./actions";

const initialState: UserState = {
    authenticating: false,
    loading: true,
    deleting: false,
    updating: true,
}

export function userReducer(prevState: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case ActionType.signinRequest: {
            const state: AuthenticationState = { authenticating: true, options: action.options };
            return { ...prevState, ...state };
        }
        case ActionType.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, authenticatedUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionType.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionType.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, authenticatedUser: null }
            return { ...prevState, ...state };
        }

        case ActionType.getRequest: {
            const state: UsersListState = { loading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getSuccess: {
            const state: UsersListState = { loading: false, users: action.users };
            return { ...prevState, ...state };
        }
        case ActionType.getFailure: {
            const state: UsersListState = { loading: false, users: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.createRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.loading === false) {
                const state: UsersListState = { loading: false, users: prevState.users.concat(action.user) };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.createFailure: return prevState;


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
        default: return prevState;
    }
}