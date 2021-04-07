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
    const [token, setToken] = useState(null);

    const login = (token: string) => {
        setToken(token);
        localStorage.setItem(
            constants.tokenKey,
            token
        );
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem(constants.tokenKey);
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
            <AppRouter>
                <AuthContext.Provider value={{isLoggedIn: isLoggedIn,
                    token: token, login: (token: string) => {
                        const navigate = useNavigate();
                        login(token);
                        navigate("profile", { replace: true });
                    }, logout: () => {
                        const navigate = useNavigate();
                        logout();
                        navigate("login", { replace: true });
                    }}}>
                </AuthContext.Provider>
            </AppRouter>
        </ThemeProvider>
    );
}
