import axios, {AxiosResponse} from "axios";
import {constants} from "../util/consts";

class AuthService {
    login(username: string, password: string): Promise<AxiosResponse> {
        return axios.post(constants.apiURL + "authenticate", {
            username: username,
            password: password
        })
    }

    signUp(email: string, password: string, username: string): Promise<AxiosResponse> {
        return axios.post(constants.apiURL + "users", {
            username: username,
            email: email,
            password: password,
        }).catch((error) => {
            return error;
        }).then((response) => {
            if(response && response?.data.token) {
                localStorage.setItem(constants.tokenKey, response?.data.token);
                return response?.data;
            }

            return null;
        });
    }
}

export const authService = new AuthService();