import { GroupDisciplineLoadState, ValidateModelState } from "./state";
import { GroupDisciplineLoad, GroupDisciplineLoadValidation, StudyLoad } from "../../models";
import { GroupDisciplineLoadActions, ActionType } from "./actions";
import { ModelState } from "../groupDisciplineLoadStore";

const initialState: GroupDisciplineLoadState = {
    modelLoading: true,
    formErrors: GroupDisciplineLoadValidation.initial
};

export function groupDisciplineLoadReducer(prevState: GroupDisciplineLoadState = initialState, action: GroupDisciplineLoadActions) {
    switch (action.type) {
        case ActionType.getModelRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getModelSuccess: {
            const state: ModelState = { modelLoading: false, index: action.index, model: action.model };
            return { ...prevState, ...state };
        }
        case ActionType.getModelFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.edit: {
            const state: ModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...state };
        }
        case ActionType.updateDetails: {
            if (prevState.modelLoading === true) return prevState;

            const model = { ...prevState.model, ...action.model };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: ModelState = { modelLoading: false, model: model };
            const validationState: ValidateModelState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState };
        }
        case ActionType.createStudyLoad: {
            if (prevState.modelLoading === true) return prevState;

            const studyLoad = prevState.model.studyLoad;

            studyLoad.push({ ...StudyLoad.initial });

            const updated: GroupDisciplineLoad = { ...prevState.model, studyLoad };

            const state: ModelState = { modelLoading: false, model: updated };
            return { ...prevState, ...state };
        }
        case ActionType.updateStudyLoad: {
            if (prevState.modelLoading === true) return prevState;

            const studyLoad = prevState.model.studyLoad;

            studyLoad[action.index] = action.model;

            const amount = studyLoad.map(o => o.value).reduce((prev, curr) => prev + curr);

            const updated: GroupDisciplineLoad = { ...prevState.model, studyLoad, amount };

            const state: ModelState = { modelLoading: false, model: updated };
            return { ...prevState, ...state };
        }
        case ActionType.deleteStudyLoad: {
            if (prevState.modelLoading === true) return prevState;

            const studyLoad = prevState.model.studyLoad;

            studyLoad.splice(action.index, 1);

            const updated: GroupDisciplineLoad = { ...prevState.model, studyLoad };

            const state: ModelState = { modelLoading: false, model: updated };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}