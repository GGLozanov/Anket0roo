import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {Box} from "@material-ui/core";
import {FillQuestionnaire} from "./fill_questionnaire";
import {useEffect, useState} from "react";
import {questionnaireService} from "../../../service/questionnaire_service";
import {useAuthContext} from "../../../context/auth_context";
import {plainToClass} from "class-transformer";
import {Questionnaire} from "../../../model/questionnaire";

export const FillQuestionnairePublic: React.FC = () => {
    const { id } = useParams();
    const authContext = useAuthContext();
    const navigate = useNavigate();

    // handle questionnaire not found error
    const [questionnaire, setQuestionnaire] = useState(null);
    // ping questionnaire by ID

    useEffect(() => {
        questionnaireService.getQuestionnaireForId(authContext, parseInt(id))
            .catch((error) => {
                console.log(error);
                navigate("/profile", { replace: true });
            }).then((response) => {
                if(response) {
                    setQuestionnaire(plainToClass(Questionnaire, response.data, { excludeExtraneousValues: true }));
                } else {
                    navigate("/profile", { replace: true });
                }
        });
    }, []);

    // render fill_questionnaire component on success
    return (
        <FillQuestionnaire questionnaire={questionnaire} />
    );
}