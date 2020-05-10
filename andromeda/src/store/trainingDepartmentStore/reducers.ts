import { TrainingDepartmentState, TrainingDepartmentsState, SelectedTrainingDepartmentState, ValidateTrainingDepartmentState, DeleteTrainingDepartmentsState } from "./state";
import { DepartmentValidation, User } from "../../models";
import { ActionType, TrainingDepartmentsActions } from "./actions";

const initialState: TrainingDepartmentState = {
    deleting: false,
    trainingDepartmentLoading: true,
    trainingDepartmentsLoading: true,

    formErrors: DepartmentValidation.initial
};

export function trainingDepartmentReducer(prevState: TrainingDepartmentState = initialState, action: TrainingDepartmentsActions): TrainingDepartmentState {
    switch (action.type) {
        case ActionType.getTrainingDepartmentsRequest: {
            const state: TrainingDepartmentsState = { trainingDepartmentsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getTrainingDepartmentsSuccess: {
            const state: TrainingDepartmentsState = { trainingDepartmentsLoading: false, trainingDepartments: action.trainingdepartments };
            return { ...prevState, ...state };
        }
        case ActionType.getTrainingDepartmentsFailure: {
            const state: TrainingDepartmentsState = { trainingDepartmentsLoading: false, trainingDepartments: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getTrainingDepartmentRequest: {
            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getTrainingDepartmentSuccess: {
            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: action.trainingdepartment };
            return { ...prevState, ...state };
        }
        case ActionType.getTrainingDepartmentFailure: {
            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.updateTrainingDepartmentDetails: {
            if (prevState.trainingDepartmentLoading === true) {
                return prevState;
            }

            const trainingDepartment = { ...prevState.trainingDepartment, ...action.trainingDepartment };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: trainingDepartment };
            const validationState: ValidateTrainingDepartmentState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }

        case ActionType.updateTrainingDepartmentUsers: {
            if (prevState.trainingDepartmentLoading === true) {
                return prevState;
            }

            const users = prevState.trainingDepartment.users.filter(o => o.id !== action.user.id);

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

            const trainingDepartment = { ...prevState.trainingDepartment, users };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment };
            return { ...prevState, ...state };
        }
        case ActionType.deleteTrainingDepartmentUsers: {
            if (prevState.trainingDepartmentLoading === true) {
                return prevState;
            }

            const users = prevState.trainingDepartment.users.filter(o => o.userId !== action.id);

            const trainingDepartment = { ...prevState.trainingDepartment, users };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment };
            return { ...prevState, ...state };
        }

        case ActionType.updateTrainingDepartmentDisciplinesTitles: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const titles = prevState.trainingDepartment.titles.filter(o => o.name !== action.disciplineTitle.name);

            titles.push(action.disciplineTitle);

            const department = { ...prevState.trainingDepartment, titles };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }
        case ActionType.deleteTrainingDepartmentDisciplinesTitles: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const titles = prevState.trainingDepartment.titles.filter(o => o.name !== action.name);

            const department = { ...prevState.trainingDepartment, titles };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }

        case ActionType.updateTrainingDepartmentStudyDirections: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const studyDirections = prevState.trainingDepartment.studyDirections.filter(o => o.name !== action.studyDirection.name);

            studyDirections.push(action.studyDirection);

            const department = { ...prevState.trainingDepartment, studyDirections };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }
        case ActionType.deleteTrainingDepartmentStudyDirections: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const studyDirections = prevState.trainingDepartment.studyDirections.filter(o => o.name !== action.name);

            const department = { ...prevState.trainingDepartment, studyDirections };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }

        case ActionType.updateTrainingDepartmentStudentGroups: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const groups = prevState.trainingDepartment.groups.filter(o => o.name !== action.studentGroup.name);

            groups.push(action.studentGroup);

            const department = { ...prevState.trainingDepartment, groups };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }
        case ActionType.deleteTrainingDepartmentStudentGroups: {
            if (prevState.trainingDepartmentLoading === true) return prevState;

            const groups = prevState.trainingDepartment.groups.filter(o => o.name !== action.name);

            const department = { ...prevState.trainingDepartment, groups };

            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: department };
            return { ...prevState, ...state };
        }

        case ActionType.saveTrainingDepartmentRequest: return prevState;
        case ActionType.createTrainingDepartmentSuccess: {
            if (prevState.trainingDepartmentsLoading === true || prevState.trainingDepartmentLoading === true) return prevState;

            const updatedModel = { ...prevState.trainingDepartment, ...action.department };
            const updatedModels = prevState.trainingDepartments.concat(action.department);

            const modelsState: TrainingDepartmentsState = { trainingDepartmentsLoading: false, trainingDepartments: updatedModels };
            const modelState: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.updateTrainingDepartmentSuccess: {
            if (prevState.trainingDepartmentsLoading === true || prevState.trainingDepartmentLoading === true) return prevState;

            const updatedModel = { ...prevState.trainingDepartment, ...action.department };
            const updatedModels = prevState.trainingDepartments.map(o => o.id == action.department.id ? action.department : o);

            const modelsState: TrainingDepartmentsState = { trainingDepartmentsLoading: false, trainingDepartments: updatedModels };
            const modelState: SelectedTrainingDepartmentState = { trainingDepartmentLoading: false, trainingDepartment: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionType.saveTrainingDepartmentFailure: return prevState;

        case ActionType.deleteTrainingDepartmentRequest: {
            const deleteState: DeleteTrainingDepartmentsState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteTrainingDepartmentSuccess: {
            if (prevState.trainingDepartmentsLoading === true) return prevState;

            const state: TrainingDepartmentsState = { trainingDepartmentsLoading: false, trainingDepartments: prevState.trainingDepartments.filter((value) => !prevState.ids.includes(value.id)) };
            const deleteState: DeleteTrainingDepartmentsState = { deleting: false, deleted: true };
            return { ...prevState, ...deleteState, ...state };
        }
        case ActionType.deleteTrainingDepartmentFailure: {
            const deleteState: DeleteTrainingDepartmentsState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.clearTrainingDepartmentEditionState: {
            const state: SelectedTrainingDepartmentState = { trainingDepartmentLoading: true, trainingDepartment: undefined };
            return { ...prevState, ...state };
        }
        case ActionType.validateTrainingDepartment: {
            const state: ValidateTrainingDepartmentState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}