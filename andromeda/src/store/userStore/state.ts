import { User, AuthenticatedUser, UserAuthenticateOptions, UserValidation } from "../../models"

export type UsersLoading = {
    loading: true;
}

export type UsersLoaded = {
    loading: false;
    users: User[];
}

export type UserGetting = {
    userLoading: true;
}

export type UserGetted = {
    userLoading: boolean;
    user?: User;
}

export type Authenticating = {
    authenticating: true;
    options: UserAuthenticateOptions;
}

export type Authenticated = {
    authenticating: boolean;
    authenticated?: boolean;
    currentUser?: AuthenticatedUser;
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

export type UserValidating = {
    formErrors?: UserValidation;
}

export type AuthenticationState = Authenticating | Authenticated;
export type UserGetState = UserGetting | UserGetted;
export type UsersListState = UsersLoading | UsersLoaded;
export type UsersDeleteState = UsersDeleting | UsersDeleted;
export type UserState = AuthenticationState & UserGetState & UsersListState & UsersDeleteState & UserValidating;