import {Questionnaire} from "../model/questionnaire";
import {AuthInclusiveService} from "./auth_inclusive_service";
import axios, {AxiosResponse} from "axios";
import {constants} from "../util/consts";
import {classToPlain} from "class-transformer";

class QuestionService extends AuthInclusiveService {
    createQuestionnaire(questionnaire: Questionnaire): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        return axios.post(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questionnaires`,
            classToPlain(questionnaire), { headers: authUsernameHeaderPair.authHeader }
        );
    }

    toggleQuestionnaireClose(questionnaireId: number): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        return axios.put(
            constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questionnaires/${questionnaireId}/close`,
            null,
            { headers: authUsernameHeaderPair.authHeader }
        );
    }

    getPublicQuestionnaires(): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        return axios.get(constants.apiURL + "questionnaires", { headers: authUsernameHeaderPair.authHeader })
    }

    // TODO: tokenUrl should be sanitized prior to input here
    getQuestionnaireForTokenUrl(tokenUrl: string): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken();

        return axios.get(constants.apiURL + `questionnaires/${tokenUrl}`, { headers: authUsernameHeaderPair.authHeader });
    }
}

export const questionnaireService = new QuestionService();