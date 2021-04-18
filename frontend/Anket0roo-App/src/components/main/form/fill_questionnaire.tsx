import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {
    Box,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    Typography
} from "@material-ui/core";
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
import {DialogTransition} from "../../../util/dialog_transition";

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
    const [chosenAnswers, setChosenAnswers] = useState<Map<number, number[]>>();
    const [error, setError] = useState(null);
    const [normalError, setNormalError] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const onFormSubmit = () => {
        console.log(`${JSON.stringify(questionnaire.questionnaireQuestions.filter((qq) =>
            qq.mandatory && (!chosenAnswers?.has(qq.question.id) ?? false)))}`);
        if(questionnaire.questionnaireQuestions.filter((qq) =>
                qq.mandatory && (!chosenAnswers?.has(qq.question.id) ?? false)).length > 0) {
            setNormalError("Mandatory questions not filled! Please fill them!");
            return;
        }
        setNormalError(null);

        const userAnswerRequests = flatten(Array.from(chosenAnswers).map(([questionId, answerIds]) =>
            answerIds.map((answerId) => new UserAnswerRequest(questionnaire.id, questionId, answerId))));
        console.log(JSON.stringify(userAnswerRequests));
        const result = tokenUrl ? questionnaireService
            .submitUserAnswersWithTokenUrl(authContext, tokenUrl, userAnswerRequests) :
                questionnaireService.submitUserAnswersWithQuestionnaireId(authContext, questionnaire.id, userAnswerRequests);
        result.catch((error) => {
            console.log(error);
            if(error) {
                switch(error.response.status) {
                    case 403:
                        setError("You do not have permission to vote for this questionnaire! You may have already partaken in it!");
                        setErrorDialogOpen(true);
                        break;
                    case 400:
                        setError("Bad input data! Please, try again!");
                        setErrorDialogOpen(true);
                        break;
                    case 500:
                        setError("Server failure! Please, try again later!");
                        setErrorDialogOpen(true);
                        break;
                }
            } else {
                setError("An error has occurred! Please, try again!");
            }
            setErrorDialogOpen(true);
        }).then((response) => {
            if(response) {
                // WEEEEEEEEEEEEEEE
                setErrorDialogOpen(false);
                navigate("/profile", { replace: true });
            } else {
                setError("Couldn't submit the answers! Please, try again!");
                setErrorDialogOpen(true);
            }
        })
    }

    const handleCheckboxAnswerSelected = (questionId: number, answerId: number, selected: boolean) => {
        console.log(`qid: ${questionId}; answerId: ${answerId}`);
        let newChosenAnswers = new Map(chosenAnswers);

        if(!selected) {
            const newAnswers = (newChosenAnswers.get(questionId) ?? []).filter(
                (chosenAnswer) => chosenAnswer != answerId);
            if(newAnswers.length == 0) {
                newChosenAnswers.delete(questionId);
            } else newChosenAnswers.set(questionId, newAnswers);
        } else {
            newChosenAnswers.set(questionId, [...(newChosenAnswers.get(questionId) ?? []), answerId]);
            console.log(`NEW chosen answers: ${JSON.stringify(Array.from(newChosenAnswers))}`);
            setChosenAnswers(newChosenAnswers);
        }
    }

    const handleRadioAnswerSelected = (questionId: number, answerId: number) => {
        let newChosenAnswers = new Map(chosenAnswers);
        newChosenAnswers.set(questionId, [answerId]);
        console.log(`NEW chosen answers: ${JSON.stringify(Array.from(newChosenAnswers))}`);
        setChosenAnswers(newChosenAnswers);
    }

    // FIXME: Code dup
    const handleDialogClose = (event: any) => {
        setErrorDialogOpen(false);
        navigate("/profile", { replace: true });
    }

    return (
        <div>
            <List>
                {questionnaire?.questionnaireQuestions?.map((questionnaireQuestion) =>
                    <ListItem>
                        <QuestionCard questionnaireQ={questionnaireQuestion} fillAnswers={true}
                                      fillCardProps={{ onCheckboxAnswerSelected: (answerId, selected) =>
                                              handleCheckboxAnswerSelected(questionnaireQuestion.question.id, answerId, selected), onRadioAnswerSelected: (answerId) =>
                                      handleRadioAnswerSelected(questionnaireQuestion.question.id, answerId)}} />
                    </ListItem>
                )}
            </List>
            <Button onClick={(event) => onFormSubmit()}>
                Submit Answers
            </Button>
            <Dialog
                open={errorDialogOpen}
                TransitionComponent={DialogTransition}
                keepMounted
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"An error has occurred!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {normalError && <div>{normalError}</div>}
        </div>
    );
}

// makes a request to the /submit endpoint upon filling request
// can take in {tokenUrl} parameter that signifies the questionnaire being filled out; otherwise gets a questionnaire directly passed in