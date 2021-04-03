import axios, {AxiosResponse} from "axios";
import {AuthInclusiveService} from "./auth_inclusive_service";
import {constants} from "../util/consts";

class UserService extends AuthInclusiveService {
    getUser(): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        return axios.get(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}`,
            { headers: authUsernameHeaderPair.authHeader })
    }
}

export const userService = new UserService();