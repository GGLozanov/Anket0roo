import * as React from "react";
import {useAuthContext} from '../../context/auth_context';
import {Login} from "./login";

interface AuthWrapperProps {
    componentToRenderOnAuth: JSX.Element
}

export const AuthWrapper = ({ componentToRenderOnAuth }: AuthWrapperProps) => {
    const authContext = useAuthContext();

    return authContext.isLoggedIn ? componentToRenderOnAuth : <Login />
};