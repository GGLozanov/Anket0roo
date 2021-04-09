import {Question} from "../model/question";
import {classToPlain} from "class-transformer";
import axios, {AxiosResponse} from "axios";
import authHeader from "../util/auth_header";
import {questionnairesMediaPath} from "../util/question_image_regex";
import {constants} from "../util/consts";
import {AuthInclusiveService} from "./auth_inclusive_service";
import {AuthContextProps} from "../context/auth_context";

class QuestionService extends AuthInclusiveService {
    createQuestion(authContext: AuthContextProps, question: Question, file?: File): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);
        const formData = new FormData();

        if(file !== null && file !== undefined) {
            formData.append("image", file);
            question.question += ` ${constants.apiURL + questionnairesMediaPath + `/${file.name}`}`;
        } else formData.append("image", null)

        console.log(`Question send: ${JSON.stringify(classToPlain(question))}`);
        console.log(`Headers: ${JSON.stringify({ ...authUsernameHeaderPair.authHeader, ...{"Content-Type": "multipart/form-data"} })}`);
        formData.append("question", JSON.stringify(classToPlain(question)));
        return axios.post(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questions`, formData, {
            headers: { ...authUsernameHeaderPair.authHeader, ...{
                "Content-Type": "multipart/form-data", 'Accept': 'application/json'} }
        });
    }

}

export const questionService = new QuestionService();