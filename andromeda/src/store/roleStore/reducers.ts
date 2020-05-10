import { RoleState, ModelState, ModelsState, DeleteState, Validation } from "./state";
import { RoleActions, ActionType } from "./actions";
import { RoleValidation, Role } from "../../models";

const initialState: RoleState = {
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: RoleValidation.initial
}

export function roleReducer(prevState: RoleState = initialState, action: RoleActions): RoleState {
    switch (action.type) {
        case ActionType.getRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getSuccess: {
            const state: ModelState = { modelLoading: false, model: action.role };
            return { ...prevState, ...state };
        }
        case ActionType.getFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getRolesRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getRolesSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.roles };
            return { ...prevState, ...state };
        }
        case ActionType.getRolesFailure: {
            const state: ModelsState = { modelsLoading: false, models: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.role };
            const updatedModels = prevState.models.concat(action.role);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.role };
            const updatedModels = prevState.models.map(o => o.id == action.role.id ? action.role : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.saveFailure: return prevState;

        case ActionType.updateRoleDetails: {
            if (prevState.modelLoading === true) {
                return prevState;
            }

            const role = { ...prevState.model, ...action.role };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            return {
                ...prevState,
                model: role,
                formErrors: formErrors
            }
        }

        case ActionType.updateRoleDepartments: {
            if (prevState.modelLoading === true) {
                return prevState;
            }

            const model: Role = {
                ...prevState.model,
                roleDepartments: action.departments
            }
            const state: ModelState = { modelLoading: false, model: model };

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
            const state: Validation = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}