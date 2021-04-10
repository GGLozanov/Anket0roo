import * as React from "react";
import {useUserContext} from "../../../context/user_context";
import {Box, GridList, GridListTile, makeStyles} from "@material-ui/core";
import {QuestionnaireCard} from "../../../layout/questionnaire_card";
import {Questionnaire} from "../../../model/questionnaire";
import {useNavigate} from "react-router";

const useStyles = makeStyles({
    grid: {
        width: 500,
        height: 450,
    }
});

export const OwnQuestionnaires: React.FC = () => {
    const userContext = useUserContext();
    const classes = useStyles();
    const navigate = useNavigate();

    const handleCardClick = (questionnaire: Questionnaire) => {
        // navigate to admin page ONLY with link
        // navigate to fill out form otherwise
        // TODO: IP/cookie check or whatever
        navigate(`/questionnaires/fill/${questionnaire.id}`, { replace: true });
    }

    const closeQuestionnare = (questionnaire: Questionnaire) => {

    }

    return (
        <GridList cols={3} className={classes.grid}>
            {userContext.user?.questionnaires.map((questionnaire) =>
                <GridListTile key={questionnaire.id}>
                    <QuestionnaireCard questionnaire={questionnaire} onCardClick={handleCardClick} onCloseQuestionnaire={closeQuestionnare} />
                </GridListTile>
            ) ?? <Box/>}
        </GridList>
    );
}