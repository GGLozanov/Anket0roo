import {constants} from "../util/consts";
import authHeader from "../util/auth_header";
import {verify} from "jsonwebtoken";

interface AuthHeaderUsernameBundle {
    authUsername: string;
    authHeader: object;
}

// TODO: Inject a unified error handler that redirects to login page here, even if it's kinda injecting the UI layer into the data manip. one
export abstract class AuthInclusiveService {
    protected getAuthUsernameAndHeaderFromContextToken(): AuthHeaderUsernameBundle {
        const token: string = localStorage.getItem(constants.tokenKey);

        try {
            const payload: any = verify(token, constants.jwtSecret, { algorithms: ["HS512"] });
            const authUsername = payload.sub;
            console.log(`token payload: ${JSON.stringify(payload)}`);

            return { authUsername: authUsername, authHeader: authHeader(token) };
        } catch(error) {
            throw new InvalidTokenError(error.toString());
        }
    }
}

export class InvalidTokenError extends Error {
    constructor(error?: Error) {
        super(error?.message);
    }
}