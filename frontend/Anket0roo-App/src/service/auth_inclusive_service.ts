import {constants} from "../util/consts";
import authHeader from "../util/auth_header";
import {verify} from "jsonwebtoken";
import {AuthContext, AuthContextProps, useAuthContext} from "../context/auth_context";

interface AuthHeaderUsernameBundle {
    authUsername: string;
    authHeader: object;
}

export abstract class AuthInclusiveService {
    protected getAuthUsernameAndHeaderFromContextToken(authContext: AuthContextProps): AuthHeaderUsernameBundle {
        const token: string = localStorage.getItem(constants.tokenKey);

        try {
            const payload: any = verify(token, constants.jwtSecret, { algorithms: ["HS512"] });
            const authUsername = payload.sub;
            console.log(`token payload: ${JSON.stringify(payload)}`);

            return { authUsername: authUsername, authHeader: authHeader(token) };
        } catch(error) {
            authContext.logout();
            throw new InvalidTokenError(error.toString()); // for additional component-level error handling (snackbar display, blabla)
        }
    }
}

export class InvalidTokenError extends Error {
    constructor(error?: Error) {
        super(error?.message);
    }
}