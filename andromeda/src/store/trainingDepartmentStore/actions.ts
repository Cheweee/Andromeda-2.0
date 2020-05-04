import { Action } from "redux";
import { TrainingDepartmentGetOptions, TrainingDepartment, ApplicationError, DepartmentValidation, User, RoleInDepartment, AppThunkAction, SnackbarVariant, AppThunkDispatch, AppState, DepartmentType, StudyDirection, StudentGroup, DisciplineTitle } from "../../models";
import { departmentService } from "../../services";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getTrainingDepartmentsRequest = 'GET_TRAINING_DEPARTMENTS_REQUEST',
    getTrainingDepartmentsSuccess = 'GET_TRAINING_DEPARTMENTS_SUCCESS',
    getTrainingDepartmentsFailure = 'GET_TRAINING_DEPARTMENTS_FAILURE',

    getTrainingDepartmentRequest = 'GET_TRAINING_DEPARTMENT_REQUEST',
    getTrainingDepartmentSuccess = 'GET_TRAINING_DEPARTMENT_SUCCESS',
    getTrainingDepartmentFailure = 'GET_TRAINING_DEPARTMENT_FAILURE',

    updateTrainingDepartmentDetails = 'UPDATE_TRAINING_DEPARTMENT_DETAILS',

    updateTrainingDepartmentUsers = 'UPDATE_TRAINING_DEPARTMENT_USERS',
    deleteTrainingDepartmentUsers = 'DELETE_TRAINING_DEPARTMENT_USERS',

    updateTrainingDepartmentStudyDirections = 'UPDATE_TRAINING_DEPARTMENT_STUDY_DIRECTIONS',
    deleteTrainingDepartmentStudyDirections = 'DELETE_TRAINING_DEPARTMENT_STUDY_DIRECTIONS',

    updateTrainingDepartmentDisciplinesTitles = 'UPDATE_TRAINING_DEPARTMENT_DISCIPLINES_TITLES',
    deleteTrainingDepartmentDisciplinesTitles = 'DELETE_TRAINING_DEPARTMENT_DISCIPLINES_TITLES',

    updateTrainingDepartmentStudentGroups = 'UPDATE_TRAINING_DEPARTMENT_STUDENT_GROUPS',
    deleteTrainingDepartmentStudentGroups = 'DELETE_TRAINING_DEPARTMENT_STUDENT_GROUPS',

    saveTrainingDepartmentRequest = 'SAVE_TRAINING_DEPARTMENT_REQUEST',
    createTrainingDepartmentSuccess = 'CREATE_TRAINING_DEPARTMENT_SUCCESS',
    updateTrainingDepartmentSuccess = 'UPDATE_TRAINING_DEPARTMENT_SUCCESS',
    saveTrainingDepartmentFailure = 'SAVE_TRAINING_DEPARTMENT_FAILURE',

    deleteTrainingDepartmentRequest = 'DELETE_TRAINING_DEPARTMENT_REQUEST',
    deleteTrainingDepartmentSuccess = 'DELETE_TRAINING_DEPARTMENT_SUCCESS',
    deleteTrainingDepartmentFailure = 'DELETE_TRAINING_DEPARTMENT_FAILURE',

    clearTrainingDepartmentEditionState = 'CLEAR_TRAINING_DEPARTMENT_EDITION_STATE',

    validateTrainingDepartment = 'VALIDATE_TRAINING_DEPARTMENT',
}
//#endregion

//#region Actions types interfaces
//#region Get training departments actions
export interface GetTrainingDepartmentsRequest extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentsRequest;
    options: TrainingDepartmentGetOptions;
}
export interface GetTrainingDepartmentsSuccess extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentsSuccess;
    trainingdepartments: TrainingDepartment[];
}
export interface GetTrainingDepartmentsFailure extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentsFailure;
    error: ApplicationError;
}
//#endregion

//#region Get training department actions
export interface GetTrainingDepartmentRequest extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentRequest;
    id?: number;
}
export interface GetTrainingDepartmentSuccess extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentSuccess;
    trainingdepartment: TrainingDepartment;
}
export interface GetTrainingDepartmentFailure extends Action<ActionType> {
    type: ActionType.getTrainingDepartmentFailure;
    error: ApplicationError;
}
//#endregion

//#region Update training department actions
export interface UpdateTrainingDepartmentDetails extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentDetails;
    trainingDepartment: TrainingDepartment;
    formErrors: DepartmentValidation;
}
//#endregion

//#region Update training department users actions
export interface UpdateTrainingDepartmentUsers extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentUsers;
    user: User;
    roles: RoleInDepartment[];
}
export interface DeleteTrainingDepartmentUsers extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentUsers;
    id: number;
}
//#endregion

//#region Update training department study directions actions
export interface UpdateTrainingDepartmentDirections extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentStudyDirections;
    studyDirection: StudyDirection;
}
export interface DeleteTrainingDepartmentStudyDirections extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentStudyDirections;
    name: string;
}
//#endregion

//#region Update training department student groups actions
export interface UpdateTrainingDepartmentGroup extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentStudentGroups;
    studentGroup: StudentGroup;
}
export interface DeleteTrainingDepartmentStudentGroup extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentStudentGroups;
    name: string;
}
//#endregion

//#region Update training department disciplines titles actions
export interface UpdateTrainingDepartmentDisciplineTitle extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentDisciplinesTitles;
    disciplineTitle: DisciplineTitle;
}
export interface DeleteTrainingDepartmentDisciplineTitle extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentDisciplinesTitles;
    name: string;
}
//#endregion

//#region Save department actions
export interface SaveTrainingDepartmentRequest extends Action<ActionType> {
    type: ActionType.saveTrainingDepartmentRequest;
    department: TrainingDepartment;
}
export interface CreateTrainingDepartmentSuccess extends Action<ActionType> {
    type: ActionType.createTrainingDepartmentSuccess;
    department: TrainingDepartment;
}
export interface UpdateTrainingDepartmentSuccess extends Action<ActionType> {
    type: ActionType.updateTrainingDepartmentSuccess;
    department: TrainingDepartment;
}
export interface SaveTrainingDepartmentFailure extends Action<ActionType> {
    type: ActionType.saveTrainingDepartmentFailure;
    error: ApplicationError;
}
//#endregion

//#region Delete department actions
export interface DeleteTrainingDepartmentRequest extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentRequest;
    ids: number[];
}
export interface DeleteTrainingDepartmentSuccess extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentSuccess;
}
export interface DeleteTrainingDepartmentFailure extends Action<ActionType> {
    type: ActionType.deleteTrainingDepartmentFailure;
    error: ApplicationError;
}
//#endregion

export interface ClearTrainingDepartmentEditionState extends Action<ActionType> {
    type: ActionType.clearTrainingDepartmentEditionState;
}

export interface ValidateTrainingDepartment extends Action<ActionType> {
    type: ActionType.validateTrainingDepartment;
    formErrors: DepartmentValidation;
}
export type GetTrainingDepartments = GetTrainingDepartmentsRequest | GetTrainingDepartmentsSuccess | GetTrainingDepartmentsFailure;
export type GetTrainingDepartment = GetTrainingDepartmentRequest | GetTrainingDepartmentSuccess | GetTrainingDepartmentFailure;
export type UpdateTrainingDepartment = UpdateTrainingDepartmentDetails;
export type SaveTrainingDepartment = SaveTrainingDepartmentRequest | CreateTrainingDepartmentSuccess | UpdateTrainingDepartmentSuccess | SaveTrainingDepartmentFailure;
export type UpdateTrainingDepartmentUsersRoles = UpdateTrainingDepartmentUsers | DeleteTrainingDepartmentUsers;
export type UpdateTrainingDepartmentStudyDirections = UpdateTrainingDepartmentDirections | DeleteTrainingDepartmentStudyDirections;
export type UpdateTrainingDepartmentStudentGroups = UpdateTrainingDepartmentGroup | DeleteTrainingDepartmentStudentGroup;
export type UpdateTrainingDepartmentDisciplineTitles = UpdateTrainingDepartmentDisciplineTitle | DeleteTrainingDepartmentDisciplineTitle;
export type DeleteTrainingDepartment = DeleteTrainingDepartmentRequest | DeleteTrainingDepartmentSuccess | DeleteTrainingDepartmentFailure;

export type TrainingDepartmentsActions = GetTrainingDepartments
    | GetTrainingDepartment
    | UpdateTrainingDepartment
    | SaveTrainingDepartment
    | UpdateTrainingDepartmentUsersRoles
    | UpdateTrainingDepartmentStudyDirections
    | UpdateTrainingDepartmentStudentGroups
    | UpdateTrainingDepartmentDisciplineTitles
    | DeleteTrainingDepartment
    | ClearTrainingDepartmentEditionState
    | ValidateTrainingDepartment;
//#endregion

function getTrainingDepartments(options: TrainingDepartmentGetOptions): AppThunkAction<Promise<GetTrainingDepartmentsSuccess | GetTrainingDepartmentsFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await departmentService.getTrainingDepartments(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: TrainingDepartmentGetOptions): GetTrainingDepartmentsRequest { return { type: ActionType.getTrainingDepartmentsRequest, options: options }; }
        function success(trainingdepartments: TrainingDepartment[]): GetTrainingDepartmentsSuccess { return { type: ActionType.getTrainingDepartmentsSuccess, trainingdepartments: trainingdepartments }; }
        function failure(error: ApplicationError): GetTrainingDepartmentsFailure { return { type: ActionType.getTrainingDepartmentsFailure, error: error }; }
    }
}
function getTrainingDepartment(id?: number): AppThunkAction<Promise<GetTrainingDepartmentSuccess | GetTrainingDepartmentFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id || id === NaN)
            return dispatch(success({ ...TrainingDepartment.initial }));

        const state = getState();
        let trainingdepartments: TrainingDepartment[] = [];

        try {
            if (state.trainingDepartmentState.trainingDepartmentsLoading === true) {
                trainingdepartments = await departmentService.getTrainingDepartments({ id, type: DepartmentType.TrainingDepartment });
                if (!trainingdepartments) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти кафедру', SnackbarVariant.warning));
                }
            } else {
                trainingdepartments = state.trainingDepartmentState.trainingDepartments;
            }

            let trainingdepartment = trainingdepartments.find(o => o.id === id);
            dispatch(validateTrainingDepartment(trainingdepartment));
            return dispatch(success(trainingdepartment));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetTrainingDepartmentRequest { return { type: ActionType.getTrainingDepartmentRequest, id: id }; }
        function success(trainingdepartment: TrainingDepartment): GetTrainingDepartmentSuccess { return { type: ActionType.getTrainingDepartmentSuccess, trainingdepartment: trainingdepartment }; }
        function failure(error: ApplicationError): GetTrainingDepartmentFailure { return { type: ActionType.getTrainingDepartmentFailure, error: error }; }
    }
}
function updateTrainingDepartmentDetails(model: TrainingDepartment): UpdateTrainingDepartmentDetails {
    const formErrors = departmentService.validateTrainingDepartment(model);

    return { type: ActionType.updateTrainingDepartmentDetails, trainingDepartment: model, formErrors: formErrors };
}
function updateTrainingDepartmentUsers(user: User, roles: RoleInDepartment[]): UpdateTrainingDepartmentUsers {
    return { type: ActionType.updateTrainingDepartmentUsers, user: user, roles: roles };
}
function deleteTrainingDepartmentUser(id: number): DeleteTrainingDepartmentUsers {
    return { type: ActionType.deleteTrainingDepartmentUsers, id: id };
}
function updateTrainingDepartmentStudyDirections(studyDirection: StudyDirection): UpdateTrainingDepartmentStudyDirections {
    return { type: ActionType.updateTrainingDepartmentStudyDirections, studyDirection: studyDirection };
}
function deleteTrainingDepartmentStudyDirections(name: string): DeleteTrainingDepartmentStudyDirections {
    return { type: ActionType.deleteTrainingDepartmentStudyDirections, name: name };
}
function updateTrainingDepartmentStudentGroups(studentGroup: StudentGroup): UpdateTrainingDepartmentStudentGroups {
    return { type: ActionType.updateTrainingDepartmentStudentGroups, studentGroup: studentGroup };
}
function deleteTrainingDepartmentStudentGroups(name: string): DeleteTrainingDepartmentStudentGroup {
    return { type: ActionType.deleteTrainingDepartmentStudentGroups, name: name };
}
function updateTrainingDepartmentDisciplinesTitles(disciplineTitle: DisciplineTitle): UpdateTrainingDepartmentDisciplineTitle {
    return { type: ActionType.updateTrainingDepartmentDisciplinesTitles, disciplineTitle: disciplineTitle };
}
function deleteTrainingDepartmentDisciplinesTitles(name: string): DeleteTrainingDepartmentDisciplineTitle {
    return { type: ActionType.deleteTrainingDepartmentDisciplinesTitles, name: name };
}
function saveTrainingDepartment(model: TrainingDepartment): AppThunkAction<Promise<CreateTrainingDepartmentSuccess | UpdateTrainingDepartmentSuccess | SaveTrainingDepartmentFailure>> {
    return async (dispatch) => {
        dispatch(request(model));

        try {
            if (model.id) {
                const result = await departmentService.update(model) as TrainingDepartment;
                dispatch(snackbarActions.showSnackbar('Кафедра успешно сохранена', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await departmentService.create(model) as TrainingDepartment;
                dispatch(snackbarActions.showSnackbar('Кафедра успешно сохранена', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(department: TrainingDepartment): SaveTrainingDepartmentRequest { return { type: ActionType.saveTrainingDepartmentRequest, department: department }; }
        function createSuccess(department: TrainingDepartment): CreateTrainingDepartmentSuccess { return { type: ActionType.createTrainingDepartmentSuccess, department: department }; }
        function updateSuccess(department: TrainingDepartment): UpdateTrainingDepartmentSuccess { return { type: ActionType.updateTrainingDepartmentSuccess, department: department }; }
        function failure(error: ApplicationError): SaveTrainingDepartmentFailure { return { type: ActionType.saveTrainingDepartmentFailure, error: error }; }
    }
}
function deleteTrainingDepartments(ids: number[]): AppThunkAction<Promise<DeleteTrainingDepartmentSuccess | DeleteTrainingDepartmentFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await departmentService.delete(ids);

            dispatch(snackbarActions.showSnackbar('Кафедра успешно удалена.', SnackbarVariant.success));
            return dispatch(success());
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteTrainingDepartmentRequest { return { type: ActionType.deleteTrainingDepartmentRequest, ids: ids }; }
        function success(): DeleteTrainingDepartmentSuccess { return { type: ActionType.deleteTrainingDepartmentSuccess }; }
        function failure(error: ApplicationError): DeleteTrainingDepartmentFailure { return { type: ActionType.deleteTrainingDepartmentFailure, error: error }; }
    }
}
function clearTrainingDepartmentEditionState(): ClearTrainingDepartmentEditionState {
    return { type: ActionType.clearTrainingDepartmentEditionState };
}
function validateTrainingDepartment(model: TrainingDepartment): ValidateTrainingDepartment {
    const result = departmentService.validateTrainingDepartment(model);
    return { type: ActionType.validateTrainingDepartment, formErrors: result };
}

export default {
    getTrainingDepartments,
    getTrainingDepartment,
    updateTrainingDepartmentDetails,
    updateTrainingDepartmentUsers,
    deleteTrainingDepartmentUser,
    updateTrainingDepartmentStudyDirections,
    deleteTrainingDepartmentStudyDirections,
    updateTrainingDepartmentStudentGroups,
    deleteTrainingDepartmentStudentGroups,
    updateTrainingDepartmentDisciplinesTitles,
    deleteTrainingDepartmentDisciplinesTitles,
    saveTrainingDepartment,
    deleteTrainingDepartments,
    clearTrainingDepartmentEditionState,
    validateTrainingDepartment
}