import { FacultyState, FacultiesState, SelectedFacultyState, ValidateFacultyState, DeleteFacultiesState } from "./state";
import { DepartmentValidation, User } from "../../models";
import { FacultiesActions, ActionType } from "./actions";

const initialState: FacultyState = {
    deleting: false,
    facultiesLoading: true,
    facultyLoading: true,

    formErrors: DepartmentValidation.initial
}

export function facultyReducer(prevState: FacultyState = initialState, action: FacultiesActions): FacultyState {
    switch (action.type) {
        case ActionType.getFacultiesRequest: {
            const state: FacultiesState = { facultiesLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultiesSuccess: {
            const state: FacultiesState = { facultiesLoading: false, faculties: action.faculties };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultiesFailure: {
            const state: FacultiesState = { facultiesLoading: false, faculties: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getFacultyRequest: {
            const state: SelectedFacultyState = { facultyLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultySuccess: {
            const state: SelectedFacultyState = { facultyLoading: false, faculty: action.faculty };
            return { ...prevState, ...state };
        }
        case ActionType.getFacultyFailure: {
            const state: SelectedFacultyState = { facultyLoading: false, faculty: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.updateFacultyDetails: {
            if (prevState.facultyLoading === true) return prevState;

            const faculty = { ...prevState.faculty, ...action.faculty };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: SelectedFacultyState = { facultyLoading: false, faculty: faculty };
            const validationState: ValidateFacultyState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }

        case ActionType.updateFacultyUsers: {
            if (prevState.facultyLoading === true) return prevState;

            const users = prevState.faculty.users.filter(o => o.id !== action.user.id);

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

            const faculty = { ...prevState.faculty, users };

            const state: SelectedFacultyState = { facultyLoading: false, faculty };
            return { ...prevState, ...state };
        }
        case ActionType.deleteFacultyUsers: {
            if (prevState.facultyLoading === true) return prevState;

            const users = prevState.faculty.users.filter(o => o.userId !== action.id);

            const faculty = { ...prevState.faculty, users };

            const state: SelectedFacultyState = { facultyLoading: false, faculty };
            return { ...prevState, ...state };
        }

        case ActionType.updateFacultyDepartments: {
            if (prevState.facultyLoading === true) return prevState;

            const departments = prevState.faculty.departments.filter(o => action.departments.some(d => d.id !== o.id));

            const faculty = {
                ...prevState.faculty,
                departments: departments.concat(action.departments)
            };

            const state: SelectedFacultyState = { facultyLoading: false, faculty: faculty };
            return { ...prevState, ...state };
        }
        case ActionType.deleteFacultyDepartments: {
            if (prevState.facultyLoading === true) return prevState;
            const departments = prevState.faculty.departments.filter(o => o.id !== action.id);
            const faculty = { ...prevState.faculty, departments }

            const state: SelectedFacultyState = { facultyLoading: false, faculty: faculty };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.facultiesLoading === true) return prevState;
            const state: FacultiesState = { facultiesLoading: false, faculties: prevState.faculties.concat(action.department) };
            return { ...prevState, ...state };
        }
        case ActionType.updateSuccess: {
            if (prevState.facultiesLoading === true) return prevState;
            const updated = prevState.faculties.map(o => o.id == action.department.id ? action.department : o);
            const state: FacultiesState = { facultiesLoading: false, faculties: updated };
            return { ...prevState, ...state };
        }
        case ActionType.saveFailure: return prevState;


        case ActionType.deleteRequest: {
            const deleteState: DeleteFacultiesState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.facultiesLoading === true) return prevState;
            const state: FacultiesState = { facultiesLoading: false, faculties: prevState.faculties.filter((value) => !prevState.ids.includes(value.id)) };
            const deleteState: DeleteFacultiesState = { deleting: false, deleted: true };
            return { ...prevState, ...deleteState, ...state };
        }
        case ActionType.deleteFailure: {
            const deleteState: DeleteFacultiesState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.clearFacultyEditionState: {
            const state: SelectedFacultyState = { facultyLoading: true, faculty: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.validateFaculty: {
            const state: ValidateFacultyState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}