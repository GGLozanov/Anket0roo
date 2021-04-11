
import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {Box} from "@material-ui/core";
import {FillQuestionnaire} from "./fill_questionnaire";
import {useEffect, useState} from "react";
import {useAuthContext} from "../../../context/auth_context";
import {questionnaireService} from "../../../service/questionnaire_service";
import {plainToClass} from "class-transformer";
import {Questionnaire} from "../../../model/questionnaire";
import {verify} from "jsonwebtoken";
import {constants} from "../../../util/consts";

export const FillQuestionnaireToken: React.FC = () => {
    const { tokenUrl } = useParams();
    const authContext = useAuthContext();
    const navigate = useNavigate();

    // handle questionnaire not found error
    const [questionnaire, setQuestionnaire] = useState(null);

    useEffect(() => {
        // jwt is validated in the backend
        questionnaireService.getQuestionnaireForTokenUrl(authContext, tokenUrl)
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
    // check if token valid, bla bla; reroute otherwise
    // render fill_questionnaire component on success
    return (
        <FillQuestionnaire questionnaire={questionnaire} tokenUrl={tokenUrl} />
    );
}