import { Role, RoleValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: Role[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: Role;
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

export type Validation = {
    formErrors?: RoleValidation;
}

export type ModelState = ModelLoading | ModelLoaded;
export type ModelsState = ModelsLoading | ModelsLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type RoleState = ModelState & ModelsState & DeleteState & Validation;