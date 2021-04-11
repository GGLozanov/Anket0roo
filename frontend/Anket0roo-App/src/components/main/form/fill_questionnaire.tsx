import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {Box, Button, List} from "@material-ui/core";
import {Questionnaire} from "../../../model/questionnaire";
import {useState} from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {QuestionCard} from "../../../layout/question_card";
import {UserAnswerRequest} from "../../../model/user_answer_req";
import {questionnaireService} from "../../../service/questionnaire_service";
import {useAuthContext} from "../../../context/auth_context";
import flatten from "../../../util/flatten";

interface FillQuestionnaireProps {
    questionnaire?: Questionnaire;
    tokenUrl?: string;
}


export const FillQuestionnaire: React.FC<FillQuestionnaireProps> = ({ questionnaire, tokenUrl }: FillQuestionnaireProps) => {
    // context-unaware component for filling questionnaire

    const authContext = useAuthContext();
    const navigate = useNavigate();

    // question id <-> answer id array
    // flatmapped on request
    const [chosenAnswers, setChosenAnswers] = useState<Map<number, number[]>>(new Map());

    const onFormSubmit = () => {
        const userAnswerRequests = flatten(Array.from(chosenAnswers).map(([questionId, answerIds]) =>
            answerIds.map((answerId) => new UserAnswerRequest(questionnaire.id, questionId, answerId))));
        console.log(JSON.stringify(userAnswerRequests));
        const result = tokenUrl ? questionnaireService
            .submitUserAnswersWithTokenUrl(authContext, tokenUrl, userAnswerRequests) :
                questionnaireService.submitUserAnswersWithQuestionnaireId(authContext, questionnaire.id, userAnswerRequests);
        result.catch((error) => {
            console.log(error);
            navigate("/profile", { replace: true });
        }).then((response) => {
            navigate("/profile", { replace: true });
        })
    }

    const handleAnswerSelected = (questionId: number, moreThanOneAnswer: boolean, answerId: number) => {
        chosenAnswers.set(questionId, moreThanOneAnswer ? chosenAnswers.get(questionId).concat(answerId) : [answerId]);
        setChosenAnswers(chosenAnswers);
    }

    return (
        <div>
            <List>
                {questionnaire?.questionnaireQuestions?.map((questionnaireQuestion) =>
                    <ListItem>
                        <QuestionCard questionnaireQ={questionnaireQuestion} fillAnswers={true}
                                      fillCardProps={{ onAnswerSelected: (answerId) =>
                                              handleAnswerSelected(questionnaireQuestion.question.id, questionnaireQuestion.moreThanOneAnswer,
                                                  answerId) }} />
                    </ListItem>
                )}
            </List>
            <Button onClick={(event) => onFormSubmit()}>
                Submit Answers
            </Button>
        </div>
    );
}

// makes a request to the /submit endpoint upon filling request
// can take in {tokenUrl} parameter that signifies the questionnaire being filled out; otherwise gets a questionnaire directly passed in