import { UserState, UsersState, AuthenticationState, DeleteUsersState, ValidateUserState, SelectedUserState } from "./state";
import { UserActions, ActionType } from "./actions";
import { UserValidation } from "../../models";

const initialState: UserState = {
    authenticating: false,
    usersLoading: true,
    deleting: false,
    userLoading: true,

    formErrors: UserValidation.initial
}

export function userReducer(prevState: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case ActionType.signinRequest: {
            const state: AuthenticationState = { authenticating: true, options: action.options };
            return { ...prevState, ...state };
        }
        case ActionType.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionType.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionType.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionType.getUserRequest: {
            const state: SelectedUserState = { userLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getUserSuccess: {
            const state: SelectedUserState = { userLoading: false, user: action.user };
            return { ...prevState, ...state };
        }
        case ActionType.getUserFailure: {
            const state: SelectedUserState = { userLoading: false, user: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getUsersRequest: {
            const state: UsersState = { usersLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersSuccess: {
            const state: UsersState = { usersLoading: false, users: action.users };
            return { ...prevState, ...state };
        }
        case ActionType.getUsersFailure: {
            const state: UsersState = { usersLoading: false, users: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.usersLoading === false) {
                const state: UsersState = { usersLoading: false, users: prevState.users.concat(action.user) };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.updateSuccess: {
            if (prevState.usersLoading === false) {
                const updated = prevState.users.map(o => o.id == action.user.id ? action.user : o);
                const state: UsersState = { usersLoading: false, users: updated };
                return { ...prevState, ...state };
            }

            return prevState;
        }
        case ActionType.saveFailure: return prevState;

        case ActionType.updateUserDetails: {
            if (prevState.userLoading === true) {
                return prevState;
            }

            const user = { ...prevState.user, ...action.user };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: SelectedUserState = { userLoading: false, user: user }; 
            const validationState: ValidateUserState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }
        case ActionType.updateUserPinnedDisciplines: {
            if (prevState.userLoading === true) {
                return prevState;
            }

            const pinnedDisciplines = prevState.user.pinnedDisciplines.filter(o => o.disciplineTitleId !== action.disciplineTitle.id);

            for (const projectType of action.projectTypes) {
                pinnedDisciplines.push({
                    disciplineTitleId: action.disciplineTitle.id,
                    userId: prevState.user.id,
                    projectType: projectType,
                    disciplineTitle: action.disciplineTitle.name,
                    title: action.disciplineTitle
                });
            }

            const user = { ...prevState.user, pinnedDisciplines }

            const state: SelectedUserState = { userLoading: false, user: user };
            return { ...prevState, ...state };
        }
        case ActionType.deleteUserPinnedDiscipline: {
            if (prevState.userLoading === true) {
                return prevState;
            }

            const pinnedDisciplines = prevState.user.pinnedDisciplines.filter(o => o.disciplineTitleId !== action.id);
            const user = { ...prevState.user, pinnedDisciplines }

            const state: SelectedUserState = { userLoading: false, user: user };
            return { ...prevState, ...state };
        }

        case ActionType.deleteRequest: {
            const deleteState: DeleteUsersState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.usersLoading === false) {
                const state: UsersState = { usersLoading: false, users: prevState.users.filter((value) => !prevState.ids.includes(value.id)) };
                const deleteState: DeleteUsersState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionType.deleteFailure: {
            const deleteState: DeleteUsersState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.validate: {
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.validateCredentials: {
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionType.clearEditionState: {
            const state: SelectedUserState = { userLoading: true, user: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}