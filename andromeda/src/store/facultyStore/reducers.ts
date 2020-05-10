import { FacultyState, ModelsState, ModelState, ValidateFacultyState, DeleteState } from "./state";
import { DepartmentValidation, User } from "../../models";
import { FacultiesActions, ActionType } from "./actions";

const initialState: FacultyState = {
    deleting: false,
    modelsLoading: true,
    modelLoading: true,

    formErrors: DepartmentValidation.initial
}

export function facultyReducer(prevState: FacultyState = initialState, action: FacultiesActions): FacultyState {
    switch (action.type) {
        case ActionType.getFacultiesRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultiesSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.faculties };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultiesFailure: {
            const state: ModelsState = { modelsLoading: false, models: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getFacultyRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultySuccess: {
            const state: ModelState = { modelLoading: false, model: action.faculty };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultyFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.updateFacultyDetails: {
            if (prevState.modelLoading === true) return prevState;

            const faculty = { ...prevState.model, ...action.faculty };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: ModelState = { modelLoading: false, model: faculty };
            const validationState: ValidateFacultyState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }

        case ActionType.updateFacultyUsers: {
            if (prevState.modelLoading === true) return prevState;

            const users = prevState.model.users.filter(o => o.id !== action.user.id);

            for (const role of action.roles) {
                users.push({
                    departmentId: role.departmentId,
                    departmentName: role.departmentName,
                    roleInDepartmentId: role.id,
                    roleId: role.roleId,
                    roleName: role.roleName,
                    userFullName: User.getFullName(action.user),
                    userId: action.user.id
                });
            }

            const faculty = { ...prevState.model, users };

            const state: ModelState = { modelLoading: false, model: faculty };
            return { ...prevState, ...state };
        }
        case ActionType.deleteFacultyUsers: {
            if (prevState.modelLoading === true) return prevState;

            const users = prevState.model.users.filter(o => o.userId !== action.id);

            const faculty = { ...prevState.model, users };

            const state: ModelState = { modelLoading: false, model: faculty };
            return { ...prevState, ...state };
        }

        case ActionType.updateFacultyDepartments: {
            if (prevState.modelLoading === true) return prevState;

            const departments = prevState.model.departments.filter(o => action.departments.some(d => d.id !== o.id));

            const faculty = {
                ...prevState.model,
                departments: departments.concat(action.departments)
            };

            const state: ModelState = { modelLoading: false, model: faculty };
            return { ...prevState, ...state };
        }
        case ActionType.deleteFacultyDepartments: {
            if (prevState.modelLoading === true) return prevState;
            const departments = prevState.model.departments.filter(o => o.id !== action.id);
            const faculty = { ...prevState.model, departments }

            const state: ModelState = { modelLoading: false, model: faculty };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.department };
            const updatedModels = prevState.models.concat(action.department);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.department };
            const updatedModels = prevState.models.map(o => o.id == action.department.id ? action.department : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.saveFailure: return prevState;


        case ActionType.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.modelsLoading === true) return prevState;
            const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((value) => !prevState.ids.includes(value.id)) };
            const deleteState: DeleteState = { deleting: false, deleted: true };
            return { ...prevState, ...deleteState, ...state };
        }
        case ActionType.deleteFailure: {
            const deleteState: DeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.clearFacultyEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.validateFaculty: {
            const state: ValidateFacultyState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}