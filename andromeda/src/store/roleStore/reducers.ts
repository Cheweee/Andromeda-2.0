import { RoleState, RoleGetState, RolesListState, RolesDeleteState, RoleValidating } from "./state";
import { RoleActions, ActionType } from "./actions";
import { RoleValidation } from "../../models";

const initialState: RoleState = {
    loading: true,
    deleting: false,
    roleLoading: true,

    formErrors: RoleValidation.initial
}

export function roleReducer(prevState: RoleState = initialState, action: RoleActions): RoleState {
    switch (action.type) {
        case ActionType.getRequest: {
            const state: RoleGetState = { roleLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getSuccess: {
            const state: RoleGetState = { roleLoading: false, role: action.role };
            return { ...prevState, ...state };
        }
        case ActionType.getFailure: {
            const state: RoleGetState = { roleLoading: false, role: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getRolesRequest: {
            const state: RolesListState = { loading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getRolesSuccess: {
            const state: RolesListState = { loading: false, roles: action.roles };
            return { ...prevState, ...state };
        }
        case ActionType.getRolesFailure: {
            const state: RolesListState = { loading: false, roles: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.loading === false) {
                const state: RolesListState = { loading: false, roles: prevState.roles.concat(action.role) };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.updateSuccess: {
            if (prevState.loading === false) {
                const updated = prevState.roles.map(o => o.id == action.role.id ? action.role : o);
                const state: RolesListState = { loading: false, roles: updated };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.saveFailure: return prevState;


        case ActionType.deleteRequest: {
            const deleteState: RolesDeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.loading === false) {
                const state: RolesListState = { loading: false, roles: prevState.roles.filter((value) => !prevState.ids.includes(value.id)) };
                const deleteState: RolesDeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionType.deleteFailure: {
            const deleteState: RolesDeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.validate: {
            const state: RoleValidating = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.clearEditionState: {
            const state: RoleGetState = { roleLoading: true, role: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}