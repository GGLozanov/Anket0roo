import * as React from "react";
import {useContext} from "react";
import {AuthContext} from '../../context/auth_context';
import {Login} from "./login";

interface AuthWrapperProps {
    componentToRenderOnAuth: JSX.Element
}

export const AuthWrapper = ({ componentToRenderOnAuth }: AuthWrapperProps) => {
    const authContext = useContext(AuthContext);

    return authContext.isLoggedIn ? componentToRenderOnAuth : <Login />
};