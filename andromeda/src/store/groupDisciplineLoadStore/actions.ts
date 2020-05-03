import { Action } from "redux";
import { GroupDisciplineLoad, GroupDisciplineLoadValidation, AppThunkAction, StudyLoad, ApplicationError, AppState, SnackbarVariant } from "../../models";
import { departmentLoadService } from "../../services/departmentLoadService";
import { departmentLoadActions } from "../departmentLoadStore";
import { snackbarActions } from "../snackbarStore";
import { trainingDepartmentActions } from "../trainingDepartmentStore";

//#region Actions types enum
export enum ActionType {
    getModelRequest = 'GET_GROUP_DISCIPLINE_LOAD_REQUEST',
    getModelSuccess = 'GET_GROUP_DISCIPLINE_LOAD_SUCCESS',
    getModelFailure = 'GET_GROUP_DISCIPLINE_LOAD_FAILURE',

    edit = 'EDIT_GROUP_DISCIPLINE_LOAD',
    updateDetails = 'UPDATE_GROUP_DISCIPLINE_LOAD_DETAILS',
    createStudyLoad = 'CREATE_GROUP_DISCIPLINE_LOAD_STUDY_LOAD',
    updateStudyLoad = 'UPDATE_GROUP_DISCIPLINE_LOAD_STUDY_LOAD',
    deleteStudyLoad = 'DELETE_GROUP_DISCIPLINE_LOAD_STUDY_LOAD',
    validate = 'VALIDATE_GROUP_DISCIPLINE_LOAD',
    save = 'SAVE_GROUP_DISCIPLINE_LOAD',
}
//#endregion

//#region Actions types interfaces
//#region Get model actions
export interface GetModelRequest extends Action<ActionType> {
    type: ActionType.getModelRequest;
    isCreateMode: boolean;
    disciplineTitleId: number;
    studentGroupId: number;
    semesterNumber: number;
}
export interface GetModelSuccess extends Action<ActionType> {
    type: ActionType.getModelSuccess;
    index?: number;
    model: GroupDisciplineLoad;
}
export interface GetModelFailure extends Action<ActionType> {
    type: ActionType.getModelFailure;
    error: ApplicationError;
}
//#endregion
export interface Edit extends Action<ActionType> {
    type: ActionType.edit;
    model: GroupDisciplineLoad;
}
export interface UpdateDetails extends Action<ActionType> {
    type: ActionType.updateDetails;
    model: GroupDisciplineLoad;
    formErrors: GroupDisciplineLoadValidation;
}
export interface CreateStudyLoad extends Action<ActionType> {
    type: ActionType.createStudyLoad;
}
export interface UpdateStudyLoad extends Action<ActionType> {
    type: ActionType.updateStudyLoad;
    index: number;
    model: StudyLoad;
}
export interface DeleteStudyLoad extends Action<ActionType> {
    type: ActionType.deleteStudyLoad;
    index: number;
}
export interface Validate extends Action<ActionType> {
    type: ActionType.validate;
    formErrors: GroupDisciplineLoadValidation;
}
export interface Save extends Action<ActionType> {
    type: ActionType.save;
}

export type GetModelActions = GetModelRequest | GetModelSuccess | GetModelFailure;
export type StudyLoadActions = CreateStudyLoad | UpdateStudyLoad | DeleteStudyLoad;

export type GroupDisciplineLoadActions = GetModelActions | Edit | UpdateDetails | StudyLoadActions | Validate | Save;
//#endregion

//#region Actions
function getModel(departmentId: number, departmentLoadId: number, isCreateMode: boolean, disciplineTitleId: number, studentGroupId: number, semesterNumber: number): AppThunkAction<Promise<GetModelSuccess | GetModelFailure>> {
    return async (dispatch, getState: () => AppState) => {
        dispatch(request(isCreateMode, disciplineTitleId, studentGroupId, semesterNumber));

        let { trainingDepartmentState, departmentLoadState } = getState();

        try {
            if (isCreateMode) {
                if (trainingDepartmentState.trainingDepartmentLoading === true) {
                    await dispatch(trainingDepartmentActions.getTrainingDepartment(departmentId));
                }

                trainingDepartmentState = getState().trainingDepartmentState;

                const groupDisciplineLoad = { ...GroupDisciplineLoad.initial };
                groupDisciplineLoad.studyLoad = [];

                if (trainingDepartmentState.trainingDepartmentLoading === false) {
                    if (disciplineTitleId || !isNaN(disciplineTitleId)) {
                        groupDisciplineLoad.disciplineTitleId = disciplineTitleId;
                        groupDisciplineLoad.disciplineTitle = trainingDepartmentState.trainingDepartment.titles.find(o => o.id === disciplineTitleId);
                    }

                    if (studentGroupId || !isNaN(studentGroupId)) {
                        groupDisciplineLoad.studentGroupId = studentGroupId;
                        groupDisciplineLoad.studentGroup = trainingDepartmentState.trainingDepartment.groups.find(o => o.id === studentGroupId);
                    }

                    if (semesterNumber || !isNaN(semesterNumber)) {
                        groupDisciplineLoad.semesterNumber = semesterNumber;
                    }
                }

                return dispatch(success(groupDisciplineLoad));
            }

            if (departmentLoadState.modelLoading === true) {
                await dispatch(departmentLoadActions.getModel(departmentLoadId));
            }

            departmentLoadState = getState().departmentLoadState;
            if (departmentLoadState.modelLoading === false) {
                const index = departmentLoadState.model.groupDisciplineLoad.findIndex(o =>
                    o.disciplineTitleId === disciplineTitleId &&
                    o.semesterNumber === semesterNumber &&
                    o.studentGroupId === studentGroupId
                );

                const groupDisciplineLoad = departmentLoadState.model.groupDisciplineLoad[index];

                return dispatch(success(groupDisciplineLoad, index));
            }
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(isCreateMode: boolean, disciplineTitleId: number, studentGroupId: number, semesterNumber: number): GetModelRequest { return { type: ActionType.getModelRequest, isCreateMode, disciplineTitleId, studentGroupId, semesterNumber }; }
        function success(model: GroupDisciplineLoad, index?: number): GetModelSuccess { return { type: ActionType.getModelSuccess, index, model }; }
        function failure(error: ApplicationError): GetModelFailure { return { type: ActionType.getModelFailure, error: error }; }
    }
}

function edit(model: GroupDisciplineLoad): Edit {
    return { type: ActionType.edit, model: model };
}
function updateDetails(model: GroupDisciplineLoad): UpdateDetails {
    const formErrors = departmentLoadService.validateGroupDisciplineLoad(model);

    return { type: ActionType.updateDetails, model: model, formErrors: formErrors };
}
function createStudyLoad(): CreateStudyLoad {
    return { type: ActionType.createStudyLoad };
}
function updateStudyLoad(index: number, studyLoad: StudyLoad): UpdateStudyLoad {
    return { type: ActionType.updateStudyLoad, index: index, model: studyLoad };
}
function deleteStudyLoad(index: number): DeleteStudyLoad {
    return { type: ActionType.deleteStudyLoad, index: index };
}
function validate(model: GroupDisciplineLoad): Validate {
    const formErrors = departmentLoadService.validateGroupDisciplineLoad(model);

    return { type: ActionType.validate, formErrors: formErrors };
}
function save(model: GroupDisciplineLoad): AppThunkAction<Save> {
    return (dispatch, getState: () => AppState) => {
        const { groupDisciplineLoadState } = getState();
        if (groupDisciplineLoadState.modelLoading === true) return;

        dispatch(departmentLoadActions.updateGroupDisciplineLoad(groupDisciplineLoadState.index, model));
        dispatch(snackbarActions.showSnackbar('Учебная нагрузка успешно сохранена', SnackbarVariant.success));

        return { type: ActionType.save };
    }
}

export default {
    getModel,
    edit,
    updateDetails,
    createStudyLoad,
    updateStudyLoad,
    deleteStudyLoad,
    validate,
    save
}
//#endregion