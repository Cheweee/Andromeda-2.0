import { GroupDisciplineLoad, GroupDisciplineLoadValidation } from "../../models";

export type ModelLoadingState = {
    modelLoading: true;
}
export type ModelLoadedState = {
    modelLoading: false;
    index?: number;
    model: GroupDisciplineLoad;
}

export type ValidateModelState = {
    formErrors?: GroupDisciplineLoadValidation;
}

export type ModelState = ModelLoadingState | ModelLoadedState;

export type GroupDisciplineLoadState = ModelState & ValidateModelState;