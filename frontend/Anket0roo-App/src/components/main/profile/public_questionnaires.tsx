import * as React from "react";
import {Box, Container, GridList, GridListTile, Typography} from "@material-ui/core";
import {useContext, useEffect, useState} from "react";
import {questionnaireService} from "../../../service/questionnaire_service";
import {plainToClass} from "class-transformer";
import {Questionnaire} from "../../../model/questionnaire";
import {QuestionnaireCard} from "../../../layout/questionnaire_card";
import {AuthContext} from "../../../context/auth_context";

export const PublicQuestionnaires: React.FC = () => {
    // refetch questionnaires (public) every time
    const [publicQuestionnaires, setPublicQuestionnaires] = useState(null);
    const [error, setError] = useState(null);

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if(publicQuestionnaires == null) {
            questionnaireService.getPublicQuestionnaires(authContext)
                .catch((error) => {
                    console.log(error);
                    setError("Something went wrong with loading the questionnaires! Please, try again!");
                }).then((response) => {
                    if(response) {
                        setPublicQuestionnaires(plainToClass(Questionnaire, response.data, { excludeExtraneousValues: true }));
                        setError(null);
                    } else {
                        setError("No response received from the server! Please, try again!");
                    }
            });
        }
    }, [publicQuestionnaires]);

    return (
        <Container>
            <GridList cols={2}>
                {publicQuestionnaires?.map((questionnaire: Questionnaire) =>
                    <GridListTile key={questionnaire.id}>
                        <QuestionnaireCard questionnaire={questionnaire} onCardClick={null} />
                    </GridListTile>
                )}
            </GridList>
            {error && <Typography component="h1" variant="h5">
                {error}
            </Typography>}
        </Container>
    );
}