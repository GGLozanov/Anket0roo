import * as React from "react";
import {Questionnaire} from "../../../model/questionnaire";
import {useNavigate, useParams} from "react-router";
import {useAuthContext} from "../../../context/auth_context";
import {useEffect, useState} from "react";
import {UserAnswerResponse} from "../../../model/user_answer_res";
import {questionnaireService} from "../../../service/questionnaire_service";
import {plainToClass} from "class-transformer";
import {ViewQuestionnaireResults} from "./view_questionnaire_results";

// FIXME: BIG CODE DUPERINO CRIPPERINO THAT MAYBE COULD BE ABSTRACTED W/ GENERICS OR JUST A BOOL (?) OR CALLBACK ARGUMENTS
export const ViewQuestionnaireResultsId: React.FC = () => {
    let { id } = useParams();

    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswerResponse[]>(null);

    useEffect(() => {
        // TODO: Code dup
        questionnaireService.getQuestionnaireForId(authContext, id)
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

        questionnaireService.getUsersAnswersWithQuestionnaireId(authContext, id)
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