import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router";

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { createBrowserHistory } from 'history';

import { routes } from "./routes";
import { sessionService } from "./services";
import { deepPurple, amber } from "@material-ui/core/colors";
import { Provider } from "react-redux";
import configureStore from "./store/createStore";

const theme = createMuiTheme({
    palette: {
        primary: deepPurple,
        secondary: amber,
    },
});

const baseUrl = document
    .getElementsByTagName("base")[0]
    .getAttribute("href")!;

sessionService.init();

const store = configureStore();
const history = createBrowserHistory({ basename: baseUrl });

ReactDOM.render(
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Router history={history}>
                    {routes}
                </Router>
            </Provider>
        </ThemeProvider>
    </React.Fragment>,
    document.getElementById("app-container")
);