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

export default function App() {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const login = (token: string) => {
        setToken(token);
        localStorage.setItem(
            constants.tokenKey,
            token
        );
        navigate("profile", { replace: true });
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem(constants.tokenKey);
        navigate("login", { replace: true });
    }

    let isLoggedIn: boolean;
    try {
        isLoggedIn = !!token;
        if(isLoggedIn) {
            verify(token, constants.jwtSecret);
        }
    } catch(ex) {
        isLoggedIn = false
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <AuthContext.Provider value={{isLoggedIn: isLoggedIn,
                    token: token, login: login, logout: logout}}>
                <AppRouter>
                </AppRouter>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}
