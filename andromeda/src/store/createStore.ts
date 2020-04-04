import { combineReducers, createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from 'redux-thunk';

import { userReducer } from './userStore/reducers'
import { snackbarReducer } from "./snackbarStore/reducers";
import { AppState } from "../models/reduxModels";

const rootReducer = combineReducers({
    userState: userReducer,
    snackbarState: snackbarReducer
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