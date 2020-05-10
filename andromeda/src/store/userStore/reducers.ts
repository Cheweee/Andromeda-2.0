import { UserState, ModelsState, AuthenticationState, DeleteState, ValidateUserState, ModelState } from "./state";
import { UserActions, ActionType } from "./actions";
import { UserValidation } from "../../models";

const initialState: UserState = {
    authenticating: false,
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: UserValidation.initial
}

export function userReducer(prevState: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case ActionType.signinRequest: {
            const state: AuthenticationState = { authenticating: true, options: action.options };
            return { ...prevState, ...state };
        }
        case ActionType.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionType.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionType.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionType.getUserRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getUserSuccess: {
            const state: ModelState = { modelLoading: false, model: action.user };
            return { ...prevState, ...state };
        }
        case ActionType.getUserFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getUsersRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.users };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersFailure: {
            const state: ModelsState = { modelsLoading: false, models: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.user };
            const updatedModels = prevState.models.concat(action.user);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.user };
            const updatedModels = prevState.models.map(o => o.id == action.user.id ? action.user : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.saveFailure: return prevState;

        case ActionType.updateUserDetails: {
            if (prevState.modelLoading === true) {
                return prevState;
            }

            const user = { ...prevState.model, ...action.user };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: ModelState = { modelLoading: false, model: user }; 
            const validationState: ValidateUserState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }
        case ActionType.updateUserPinnedDisciplines: {
            if (prevState.modelLoading === true) return prevState;

            const pinnedDisciplines = prevState.model.pinnedDisciplines.filter(o => o.disciplineTitleId !== action.disciplineTitle.id);

            for (const projectType of action.projectTypes) {
                pinnedDisciplines.push({
                    userId: prevState.model.id,
                    projectType: projectType,
                    disciplineTitleId: action.disciplineTitle.id,
                    title: action.disciplineTitle
                });
            }

            const user = { ...prevState.model, pinnedDisciplines }

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state };
        }
        case ActionType.deleteUserPinnedDiscipline: {
            if (prevState.modelLoading === true) return prevState; 

            const pinnedDisciplines = prevState.model.pinnedDisciplines.filter(o => o.disciplineTitleId !== action.id);
            const user = { ...prevState.model, pinnedDisciplines }

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state };
        }
        case ActionType.updateGraduateDegrees: {
            if (prevState.modelLoading === true) return prevState;

            const graduateDegrees = prevState.model.graduateDegrees.filter(o => o.branchOfScience !== action.branchOfScience);

            graduateDegrees.push({
                branchOfScience: action.branchOfScience,
                graduateDegree: action.graduateDegree,
                userId: prevState.model.id
            });

            const user = { ...prevState.model, graduateDegrees }

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state };
        }
        case ActionType.deleteGraduateDegree: {
            if (prevState.modelLoading === true) return prevState;

            const graduateDegrees = prevState.model.graduateDegrees.filter(o => o.branchOfScience !== action.branchOfScience);
            const user = { ...prevState.model, graduateDegrees }

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state };
        }

        case ActionType.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.modelsLoading === false) {
                const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((value) => !prevState.ids.includes(value.id)) };
                const deleteState: DeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionType.deleteFailure: {
            const deleteState: DeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.validate: {
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.validateCredentials: {
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}