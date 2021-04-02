import { createContext } from "react";

// FIXME: Might need more stuff
export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    login: () => {},
    logout: () => {}
});