import {constants} from "./consts";

export default function authHeader(token: string = null): object {
    const jwt = token == null ? localStorage.getItem(constants.tokenKey) : token;

    if (jwt) {
        return { "Authorization": 'Bearer ' + jwt };
    } else {
        return null;
    }
}