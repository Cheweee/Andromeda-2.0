import { User, AuthenticatedUser, UserAuthenticateOptions, UserValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: User[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: User;
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

export type ModelsDeleting = {
    deleting: true;
    ids: number[];
}

export type ModelsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type ValidateUserState = {
    formErrors?: UserValidation;
}

export type AuthenticationState = Authenticating | Authenticated;
export type ModelState = ModelLoading | ModelLoaded;
export type ModelsState = ModelsLoading | ModelsLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type UserState = AuthenticationState & ModelState & ModelsState & DeleteState & ValidateUserState;