import * as React from "react";
import {useAuthContext} from '../../context/auth_context';
import {Login} from "./login";
import {Navigate, useNavigate} from "react-router";

interface AuthWrapperProps {
    isLoggedIn: boolean;
}

interface AuthRouteWrapperProps extends AuthWrapperProps {
    pathToPushOnAuth: string;
}

interface AuthComponentWrapperProps extends AuthWrapperProps {
    componentToRenderOnAuth: React.ReactElement;
}

export const AuthRouteWrapper: React.FC<AuthRouteWrapperProps> = ({ pathToPushOnAuth, isLoggedIn }: AuthRouteWrapperProps) => {
    return <Navigate to={isLoggedIn ? pathToPushOnAuth : "/login"} replace={true} />; // Eh, could go with hook but w/e
}

export const AuthComponentWrapper: React.FC<AuthComponentWrapperProps> = ({ componentToRenderOnAuth, isLoggedIn }: AuthComponentWrapperProps) => {
    return isLoggedIn ? componentToRenderOnAuth : <Navigate to={"/login"} replace={true} />;
}