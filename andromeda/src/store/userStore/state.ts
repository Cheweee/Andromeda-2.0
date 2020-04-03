import { User, AuthenticatedUser, ApplicationError, UserAuthenticateOptions } from "../../models"
import { AppState } from "../createStore"

export type UsersLoading = {
    loading: true;
}

export type UsersLoaded = {
    loading: false;
    users: User[];
}

export type Authenticating = {
    authenticating: true;
    options: UserAuthenticateOptions;
}

export type Authenticated = {
    authenticating: boolean;
    authenticated?: boolean;
    authenticatedUser?: AuthenticatedUser;
}

export type UsersDeleting = {
    deleting: true;
    ids: number[];
}

export type UsersDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type UserEditLoading = {
    updating: true;
}

export type UserEditLoaded = {
    updating: false;
    updated?: boolean;
    user: User;
}

export type AuthenticationState = Authenticating | Authenticated;
export type UsersListState = UsersLoading | UsersLoaded;
export type UsersDeleteState = UsersDeleting | UsersDeleted;
export type UserEditState = UserEditLoading | UserEditLoaded;
export type UserState = AuthenticationState & UsersListState & UsersDeleteState & UserEditState;