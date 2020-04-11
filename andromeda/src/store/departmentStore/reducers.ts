import { DepartmentState } from "./state";
import { DepartmentActions, ActionType } from "./actions";

const initialState: DepartmentState = { loading: true };

export function departmentReducer(prevState: DepartmentState = initialState, action: DepartmentActions): DepartmentState {
    switch (action.type) {
        case ActionType.getDepartmentsRequest: {
            const state: DepartmentState = { loading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getDepartmentsSuccess: {
            const state: DepartmentState = { loading: false, departments: action.departments };
            return { ...prevState, ...state };
        }
        case ActionType.getDepartmentsFailure: {
            const state: DepartmentState = { loading: false, departments: undefined };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}