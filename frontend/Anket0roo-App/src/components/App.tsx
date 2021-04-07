import * as React from "react";
import { AppRouter } from '../router/router';
import WebFont from "webfontloader";
import { ThemeProvider } from "@material-ui/core/styles";
import {mainTheme} from "../theme/main_theme";
import {AuthContext} from "../context/auth_context";
import {useEffect, useState} from "react";
import {constants} from "../util/consts";
import {useNavigate} from "react-router";
import {verify} from "jsonwebtoken";

WebFont.load({google: {families: ["Roboto:300,400,500"]}});

export const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem(constants.tokenKey));

    // navigation actions SHOULD be located here
    // but circular dependency of router to `useNavigate` hook with AuthContext makes this somewhat not-doable for now
    // simple use case so just suffix each call to login with the corresponding navigation action

    const login = (token: string) => {
        console.log("Logging in");
        setToken(token);
        localStorage.setItem(
            constants.tokenKey,
            token
        );
    }

    const logout = () => {
        console.log("Logging out");
        setToken(null);
        localStorage.removeItem(constants.tokenKey);
    }

    let isLoggedIn: boolean;
    try {
        isLoggedIn = !!token;
        if(isLoggedIn) {
            verify(token, constants.jwtSecret, { algorithms: ["HS512"] });
        }
    } catch(ex) {
        console.log(ex);
        isLoggedIn = false
    }

    console.log(`token: ${token}`);
    console.log(`logged in: ${isLoggedIn}`);

    return (
        <ThemeProvider theme={mainTheme}>
            <AuthContext.Provider value={{isLoggedIn: isLoggedIn,
                token: token, login: login, logout: logout}}>
                <AppRouter loggedIn={isLoggedIn}>
                </AppRouter>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}
