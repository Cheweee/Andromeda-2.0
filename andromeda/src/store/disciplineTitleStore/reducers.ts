import { DisciplineTitleState, DisciplineTitleGetState, DisciplinesTitlesGetState } from "./state";
import { DisciplineTitleActions, ActionType } from "./actions";

const initialState: DisciplineTitleState = {
    disciplineTitleLoading: true,
    loading: true
}

export function disciplineTitleReducer(prevState: DisciplineTitleState = initialState, action: DisciplineTitleActions): DisciplineTitleState {
    switch(action.type) {
        case ActionType.getRequest: {
            const state: DisciplineTitleGetState = { disciplineTitleLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getSuccess: {
            const state: DisciplineTitleGetState = { disciplineTitleLoading: false, disciplineTitle: action.disciplineTitle };
            return { ...prevState, ...state };
        }
        case ActionType.getFailure: {
            const state: DisciplineTitleGetState = { disciplineTitleLoading: false, disciplineTitle: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getDisciplinesTitlesRequest: {
            const state: DisciplinesTitlesGetState = { loading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getDisciplinesTitlesSuccess: {
            const state: DisciplinesTitlesGetState = { loading: false, disciplinesTitles: action.disciplinesTitles };
            return { ...prevState, ...state };
        }
        case ActionType.getDisciplinesTitlesFailure: {
            const state: DisciplinesTitlesGetState = { loading: false, disciplinesTitles: undefined };
            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}