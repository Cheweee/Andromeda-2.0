import { combineReducers, createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from 'redux-thunk';

import { AppState } from "../models/reduxModels";

import { facultyReducer } from "./facultyStore/reducers";
import { userReducer } from './userStore/reducers'
import { snackbarReducer } from "./snackbarStore/reducers";
import { disciplineTitleReducer } from "./disciplineTitleStore/reducers";
import { roleReducer } from './roleStore/reducers';
import { departmentReducer } from "./departmentStore/reducers";
import { trainingDepartmentReducer } from "./trainingDepartmentStore/reducers";
import { departmentLoadReducer } from "./departmentLoadStore/reducers";
import { groupDisciplineLoadReducer } from "./groupDisciplineLoadStore/reducers";

const rootReducer = combineReducers({
    facultyState: facultyReducer,
    departmentState: departmentReducer,
    userState: userReducer,
    snackbarState: snackbarReducer,
    disciplineTitleState: disciplineTitleReducer,
    roleState: roleReducer,
    trainingDepartmentState: trainingDepartmentReducer,
    departmentLoadState: departmentLoadReducer,
    groupDisciplineLoadState: groupDisciplineLoadReducer
});

export default function configureStore(): Store<AppState> {
    const middlewares = [thunkMiddleware];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );

    return store;
}