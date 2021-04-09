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
import {UserContext} from "../context/user_context";
import {userService} from "../service/user_service";
import {plainToClass} from "class-transformer";
import {User} from "../model/user";
import {Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

WebFont.load({google: {families: ["Roboto:300,400,500"]}});

export const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem(constants.tokenKey))
    const [authUser, setAuthUser] = useState(null);

    const [snackbarOpen, setSnackBarOpen] = useState(false); // global authentication state snackbar

    const onSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    }

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

    useEffect(() => {
        if(authUser == null && isLoggedIn) {
            userService.getUser({isLoggedIn: !!token, login: login, logout: logout, token: token }) // only need logout call
            .catch((error) => {
                // reauth on every error; error handling 100
                logout()
            }).then((response) => {
                if (response && response.data.username) {
                    setAuthUser(plainToClass(User, response.data, {excludeExtraneousValues: true}));
                } else {
                    setSnackBarOpen(true)
                }
            });
        }
    }, [authUser, isLoggedIn]);

    console.log(`token: ${token}`);
    console.log(`logged in: ${isLoggedIn}`);

    return (
        <ThemeProvider theme={mainTheme}>
            <UserContext.Provider value={{user: authUser, addQuestion:
                    (question) => authUser?.questions?.push(question), addQuestionnaire:
                    (questionnaire) => authUser?.questionnaires?.push(questionnaire),
                    setUser: (user) => setAuthUser(user)}}>
                <AuthContext.Provider value={{isLoggedIn: isLoggedIn,
                    token: token, login: login, logout: logout}}>
                    <AppRouter loggedIn={isLoggedIn}>
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={onSnackbarClose}>
                            <MuiAlert elevation={6} variant="filled" onClose={onSnackbarClose} severity="error">
                                Something went wrong with your authentication! Please login again!</MuiAlert>
                        </Snackbar>
                    </AppRouter>
                </AuthContext.Provider>
            </UserContext.Provider>
        </ThemeProvider>
    );
}
