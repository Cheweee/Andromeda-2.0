import { TrainingDepartment, DepartmentValidation } from "../../models"

export type TrainingDepartmentsLoading = {
    trainingDepartmentsLoading: true;
}

export type TrainingDepartmentsLoaded = {
    trainingDepartmentsLoading: false;
    trainingDepartments: TrainingDepartment[];
}

export type TrainingDepartmentLoading = {
    trainingDepartmentLoading: true;
}

export type TrainingDepartmentLoaded = {
    trainingDepartmentLoading: boolean;
    trainingDepartment?: TrainingDepartment;
}

export type TrainingDepartmentsDeleting = {
    deleting: true;
    ids: number[];
}

export type TrainingDepartmentsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type ValidateTrainingDepartmentState = {
    formErrors?: DepartmentValidation;
}

export type TrainingDepartmentsState = TrainingDepartmentsLoading | TrainingDepartmentsLoaded;
export type SelectedTrainingDepartmentState = TrainingDepartmentLoading | TrainingDepartmentLoaded;
export type DeleteTrainingDepartmentsState = TrainingDepartmentsDeleting | TrainingDepartmentsDeleted;

export type TrainingDepartmentState = TrainingDepartmentsState & SelectedTrainingDepartmentState & DeleteTrainingDepartmentsState & ValidateTrainingDepartmentState;