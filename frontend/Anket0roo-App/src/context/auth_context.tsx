import {createContext, useContext} from "react";

export interface AuthContextProps {
    isLoggedIn: boolean; token?: string;
    login: (token: string) => void; logout: () => void;
}

// FIXME: Might need more stuff
export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    token: null,
    login: (token: string) => {},
    logout: () => {}
});

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);

    if(authContext === undefined) {
        throw Error("Auth context cannot be accessed in component without a top-level provider!");
    }

    return authContext;
}