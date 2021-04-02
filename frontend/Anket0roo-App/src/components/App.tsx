import * as React from "react";
import ReactDOM from 'react-dom';
import { AppRouter } from '../router/router';
import WebFont from "webfontloader";
import { ThemeProvider } from "@material-ui/core/styles";
import {mainTheme} from "../theme/main_theme";
import {AuthContext} from "../context/auth_context";
import {useState} from "react";

WebFont.load({google: {families: ["Roboto:300,400,500"]}});

const tokenKey = "token";

export default function App() {
    const [token, setToken] = useState(localStorage.getItem(tokenKey))

    const login = () => {
        setToken(token);

        localStorage.setItem(tokenKey, token)
    }
    const logout = () => {
        setToken(null);
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <AuthContext.Provider value={{isLoggedIn: !!token, token: null, login: login, logout: logout}}>
                <AppRouter>
                </AppRouter>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}
