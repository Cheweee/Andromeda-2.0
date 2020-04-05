import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { UserState } from "../store/userStore";
import { SnackbarState } from "../store/snackbarStore/state";
import { DisciplineTitleState } from "../store/disciplineTitleStore";
import { RoleState } from "../store/roleStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch<ReturnType = void> = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    userState: UserState;
    snackbarState: SnackbarState;
    disciplineTitleState: DisciplineTitleState;
    roleState: RoleState;
}