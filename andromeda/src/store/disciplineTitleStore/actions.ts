import { Action } from "redux";

import { AppThunkAction, AppState, AppThunkDispatch } from "../../models/reduxModels";
import { DisciplineTitleGetOptions, DisciplineTitle, ApplicationError, SnackbarVariant } from "../../models";
import { disciplineTitleService } from "../../services/disciplineTitleService";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionType {
    getDisciplinesTitlesRequest = 'GET_DISCIPLINES_TITLES_REQUEST',
    getDisciplinesTitlesSuccess = 'GET_DISCIPLINES_TITLES_SUCCESS',
    getDisciplinesTitlesFailure = 'GET_DISCIPLINES_TITLES_FAILURE',

    getRequest = 'GET_REQUEST',
    getSuccess = 'GET_SUCCESS',
    getFailure = 'GET_FAILURE'
}
//#endregion

//#region Actions types interfaces
export interface GetDisciplinesTitlesRequest extends Action<ActionType> {
    type: ActionType.getDisciplinesTitlesRequest;
    options: DisciplineTitleGetOptions;
}

export interface GetDisciplinesTitlesSuccess extends Action<ActionType> {
    type: ActionType.getDisciplinesTitlesSuccess;
    disciplinesTitles: DisciplineTitle[];
}

export interface GetDisciplinesTitlesFailure extends Action<ActionType> {
    type: ActionType.getDisciplinesTitlesFailure;
    error: ApplicationError;
}

export interface GetRequest extends Action<ActionType> {
    type: ActionType.getRequest;
    id?: number;
}

export interface GetSuccess extends Action<ActionType> {
    type: ActionType.getSuccess;
    disciplineTitle: DisciplineTitle;
}

export interface GetFailure extends Action<ActionType> {
    type: ActionType.getFailure;
    error: ApplicationError;
}

export type GetDisciplinesTitles = GetDisciplinesTitlesRequest | GetDisciplinesTitlesSuccess | GetDisciplinesTitlesFailure;
export type GetDisciplineTitle = GetRequest | GetSuccess | GetFailure;

export type DisciplineTitleActions = GetDisciplinesTitles | GetDisciplineTitle;
//#endregion

//#region Actions
function getDisciplinesTitles(options: DisciplineTitleGetOptions): AppThunkAction<Promise<GetDisciplinesTitlesSuccess | GetDisciplinesTitlesFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await disciplineTitleService.getTitles(options);
            return dispatch(success(result));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: DisciplineTitleGetOptions): GetDisciplinesTitlesRequest { return { type: ActionType.getDisciplinesTitlesRequest, options: options }; }
        function success(models: DisciplineTitle[]): GetDisciplinesTitlesSuccess { return { type: ActionType.getDisciplinesTitlesSuccess, disciplinesTitles: models }; }
        function failure(error: ApplicationError): GetDisciplinesTitlesFailure { return { type: ActionType.getDisciplinesTitlesFailure, error: error }; }
    }
}

function getDisciplineTitle(id?: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id || id === NaN)
            return dispatch(success(DisciplineTitle.initial));

        const state = getState();
        let disciplinetitles: DisciplineTitle[] = [];

        try {
            if (state.disciplineTitleState.loading === true) {
                disciplinetitles = await disciplineTitleService.getTitles({ id: id });
                if (!disciplinetitles) {
                    dispatch(snackbarActions.showSnackbar('Не удалось найти пользователя', SnackbarVariant.warning));
                }
            } else {
                disciplinetitles = state.disciplineTitleState.disciplinesTitles;
            }

            let disciplinetitle = disciplinetitles.find(o => o.id === id);
            return dispatch(success(disciplinetitle));
        }
        catch (error) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionType.getRequest, id: id }; }
        function success(disciplineTitle: DisciplineTitle): GetSuccess { return { type: ActionType.getSuccess, disciplineTitle: disciplineTitle }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionType.getFailure, error: error }; }
    }
}

export default {
    getDisciplinesTitles,
    getDisciplineTitle
}
//#endregion
