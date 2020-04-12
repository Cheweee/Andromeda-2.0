import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { UserState } from "../store/userStore";
import { SnackbarState } from "../store/snackbarStore/state";
import { DisciplineTitleState } from "../store/disciplineTitleStore";
import { RoleState } from "../store/roleStore";
import { DepartmentState } from "../store/departmentStore";
import { FacultyState } from "../store/facultyStore";
import { TrainingDepartmentState } from "../store/trainingDepartmentStore";
import { DepartmentLoadState } from "../store/departmentLoadStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    facultyState: FacultyState;
    userState: UserState;
    snackbarState: SnackbarState;
    disciplineTitleState: DisciplineTitleState;
    roleState: RoleState;
    departmentState: DepartmentState;
    trainingDepartmentState: TrainingDepartmentState;
    departmentLoadState: DepartmentLoadState;
}