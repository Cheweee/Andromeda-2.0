import { DepartmentLoad, GroupDisciplineLoadValidation, UserDisciplineLoadValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}
export type ModelsLoaded = {
    modelsLoading: false;
    models?: DepartmentLoad[];
}

export type ModelLoading = {
    modelLoading: true;
}
export type ModelLoaded = {
    modelLoading: boolean;
    model?: DepartmentLoad;
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

export type ValidateGroupDisciplineLoadState = {
    groupDisciplineLoadFormErrors?: GroupDisciplineLoadValidation;
}

export type ValidateUserDisciplineLoadState = {
    userDisciplineLoadFormErrors?: UserDisciplineLoadValidation;
}

export type ImportState = {
    importing: boolean;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type ValidationState = ValidateGroupDisciplineLoadState | ValidateGroupDisciplineLoadState

export type DepartmentLoadState = ModelsState
    & ModelState
    & DeleteState
    & ImportState
    & ValidationState;