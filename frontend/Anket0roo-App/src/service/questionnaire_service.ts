import {Questionnaire} from "../model/questionnaire";
import {AuthInclusiveService} from "./auth_inclusive_service";
import axios, {AxiosResponse} from "axios";
import {constants} from "../util/consts";
import {classToPlain} from "class-transformer";
import {AuthContextProps} from "../context/auth_context";
import {QuestionnaireQuestionRequest} from "../model/questionnaire_question_req";
import {UserAnswerRequest} from "../model/user_answer_req";

class QuestionnaireService extends AuthInclusiveService {
    createQuestionnaire(authContext: AuthContextProps, questionnaire: Questionnaire<QuestionnaireQuestionRequest>): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.post(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questionnaires`,
            classToPlain(questionnaire), { headers: authUsernameHeaderPair.authHeader }
        );
    }

    toggleQuestionnaireClose(authContext: AuthContextProps, questionnaireId: number): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.put(
            constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questionnaires/${questionnaireId}/toggle_open`,
            null,
            { headers: authUsernameHeaderPair.authHeader }
        );
    }

    getPublicQuestionnaires(authContext: AuthContextProps): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.get(constants.apiURL + "questionnaires", { headers: authUsernameHeaderPair.authHeader });
    }

    getQuestionnaireForTokenUrl(authContext: AuthContextProps, tokenUrl: string): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.get(constants.apiURL + `questionnaires/${tokenUrl}`, { headers: authUsernameHeaderPair.authHeader });
    }

    getQuestionnaireForId(authContext: AuthContextProps, id: number): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.get(constants.apiURL + `questionnaires/ping/${id}`, { headers: authUsernameHeaderPair.authHeader });
    }

    submitUserAnswersWithTokenUrl(authContext: AuthContextProps, tokenUrl: string, userAnswers: UserAnswerRequest[]): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.post(constants.apiURL + `questionnaires/${tokenUrl}/submit`, classToPlain(userAnswers),
            { headers: authUsernameHeaderPair.authHeader });
    }

    submitUserAnswersWithQuestionnaireId(authContext: AuthContextProps, questionnaireId: number, userAnswers: UserAnswerRequest[]): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.post(constants.apiURL + `questionnaires/ping/${questionnaireId}/submit`, classToPlain(userAnswers),
            { headers: authUsernameHeaderPair.authHeader });
    }

    getUserAnswersWithTokenUrl(authContext: AuthContextProps, tokenUrl: string): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.get(constants.apiURL + `questionnaires/admin/${tokenUrl}`,
            { headers: authUsernameHeaderPair.authHeader });
    }
    
    getUsersAnswersWithQuestionnaireId(authContext: AuthContextProps, questionnaireId: number): Promise<AxiosResponse> {
        const authUsernameHeaderPair = this.getAuthUsernameAndHeaderFromContextToken(authContext);

        return axios.get(constants.apiURL + `users/${authUsernameHeaderPair.authUsername}/questionnaires/admin/${questionnaireId}`,
            { headers: authUsernameHeaderPair.authHeader });
    }
}

export const questionnaireService = new QuestionnaireService();