import * as React from "react";
import ReactDOM from 'react-dom';
import { AppRouter } from '../router/router';
import WebFont from "webfontloader";
import { ThemeProvider } from "@material-ui/core/styles";
import {mainTheme} from "../theme/main_theme";
import {AuthContext} from "../context/auth_context";
import {useEffect, useState} from "react";
import {constants} from "../util/consts";

WebFont.load({google: {families: ["Roboto:300,400,500"]}});

export default function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const jwt = localStorage.getItem(constants.tokenKey);

    });

    return (
        <ThemeProvider theme={mainTheme}>
            <AuthContext.Provider value={{isLoggedIn: !!token, token: token}}>
                <AppRouter>
                </AppRouter>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}
