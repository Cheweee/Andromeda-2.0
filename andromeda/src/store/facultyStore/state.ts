import { Faculty, DepartmentValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: Faculty[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: Faculty;
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

export type ValidateFacultyState = {
    formErrors?: DepartmentValidation;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;

export type FacultyState = ModelsState & ModelState & DeleteState & ValidateFacultyState;