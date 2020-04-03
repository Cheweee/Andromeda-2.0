import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { UserState } from "../store/userStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch<ReturnType = void> = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    userState: UserState
}