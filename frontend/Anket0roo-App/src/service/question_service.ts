import {Question} from "../model/question";
import {classToPlain} from "class-transformer";
import axios, {AxiosResponse} from "axios";
import authHeader from "../util/auth_header";
import {questionnairesMediaPath} from "../util/question_image_regex";
import {constants} from "../util/consts";
import {AuthInclusiveService} from "./auth_inclusive_service";

class QuestionService extends AuthInclusiveService {
    createQuestion(question: Question, file?: File): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();
        const formData = new FormData();

        if(file !== null && file !== undefined) {
            formData.append("image", file);
            question.question += ` ${constants.apiURL + questionnairesMediaPath + `${file.name}`}`;
        }

        formData.append("question", JSON.stringify(classToPlain(question)));
        return axios({
            method: "post",
            url: constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questions`,
            data: formData,
            headers: { ...authUsernameHeaderPair.authHeader, ...{"Content-Type": "multipart/form-data"} }
        })
    }

}

export const questionnaireService = new QuestionService();