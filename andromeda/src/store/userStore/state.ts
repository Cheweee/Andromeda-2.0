import { User, AuthenticatedUser, UserAuthenticateOptions, UserValidation } from "../../models"

export type UsersLoading = {
    usersLoading: true;
}

export type UsersLoaded = {
    usersLoading: false;
    users: User[];
}

export type UserLoading = {
    userLoading: true;
}

export type UserLoaded = {
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

export type ValidateUserState = {
    formErrors?: UserValidation;
}

export type AuthenticationState = Authenticating | Authenticated;
export type SelectedUserState = UserLoading | UserLoaded;
export type UsersState = UsersLoading | UsersLoaded;
export type DeleteUsersState = UsersDeleting | UsersDeleted;
export type UserState = AuthenticationState & SelectedUserState & UsersState & DeleteUsersState & ValidateUserState;