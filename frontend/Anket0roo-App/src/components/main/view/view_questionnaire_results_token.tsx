import * as React from "react";
import {Questionnaire} from "../../../model/questionnaire";
import {useNavigate, useParams} from "react-router";
import {useAuthContext} from "../../../context/auth_context";
import {useEffect, useState} from "react";
import {UserAnswerResponse} from "../../../model/user_answer_res";
import {questionnaireService} from "../../../service/questionnaire_service";
import {plainToClass} from "class-transformer";
import {ViewQuestionnaireResults} from "./view_questionnaire_results";

export const ViewQuestionnaireResultsToken: React.FC = () => {
    let { tokenUrl } = useParams();

    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswerResponse[]>(null);

    useEffect(() => {
        // TODO: Code dup
        questionnaireService.getQuestionnaireForTokenUrl(authContext, tokenUrl)
            .catch((error) => {
                console.log(error);
                navigate("/profile", { replace: true });
            }).then((response) => {
            if(response) {
                console.log(response?.data);
                setQuestionnaire(plainToClass(Questionnaire, response.data, { excludeExtraneousValues: true }));
            } else {
                navigate("/profile", { replace: true });
            }
        });

        questionnaireService.getUserAnswersWithTokenUrl(authContext, tokenUrl)
            .catch((error) => {
                console.log(error);
                navigate("/profile", { replace: true });
            }).then((response) => {
            if(response) {
                // @ts-ignore
                setUserAnswers(plainToClass(UserAnswerResponse, response.data, { excludeExtraneousValues: true }));
            }
        });
    }, []);

    return (
        <ViewQuestionnaireResults questionnaire={questionnaire} userAnswers={userAnswers} />
    );
}