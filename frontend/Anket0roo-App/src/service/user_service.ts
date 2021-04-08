import axios, {AxiosResponse} from "axios";
import {AuthInclusiveService} from "./auth_inclusive_service";
import {constants} from "../util/consts";
import {AuthContextProps} from "../context/auth_context";

class UserService extends AuthInclusiveService {
    getUser(authContext: AuthContextProps): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        console.log('Header: ' + JSON.stringify(authUsernameHeaderPair.authHeader));
        return axios.get(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}`,
            { headers: authUsernameHeaderPair.authHeader });
    }
}

export const userService = new UserService();