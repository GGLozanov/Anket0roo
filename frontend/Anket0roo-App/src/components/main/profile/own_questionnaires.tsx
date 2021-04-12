import * as React from "react";
import {useUserContext} from "../../../context/user_context";
import {Box, GridList, GridListTile, IconButton, makeStyles, Snackbar} from "@material-ui/core";
import {QuestionnaireCard} from "../../../layout/questionnaire_card";
import {Questionnaire} from "../../../model/questionnaire";
import {useNavigate} from "react-router";
import {questionnaireService} from "../../../service/questionnaire_service";
import {useAuthContext} from "../../../context/auth_context";
import {useState} from "react";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    // TODO: FILL
});

export const OwnQuestionnaires: React.FC = () => {
    const userContext = useUserContext();
    const authContext = useAuthContext();
    const classes = useStyles();
    const navigate = useNavigate();

    const [closeSnackbarOpen, setCloseSnackbarOpen] = useState(false);
    const [closeSnackbarMessage, setCloseSnackbarMessage] = useState("Questionnaire closed!");

    const handleCardClick = (questionnaire: Questionnaire) => {
        // navigate to admin page ONLY with link
        // navigate to fill out form otherwise
        navigate(`/questionnaires/fill/${questionnaire.id}`, { replace: true });
    }

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setCloseSnackbarOpen(false);
    };

    const closeQuestionnaire = (questionnaire: Questionnaire) => {
        questionnaireService.toggleQuestionnaireClose(authContext, questionnaire.id)
            .catch((error) => {
                console.log(error);
                setCloseSnackbarMessage(`Questionnaire couldn't be ${questionnaire.closed ? "Closed" : "Opened"}!`);
                setCloseSnackbarOpen(false);
            }).then((response) => {
                userContext.toggleQuestionnaireClose(questionnaire.id, !questionnaire.closed);
                setCloseSnackbarMessage(`Questionnaire ${questionnaire.closed ? "Closed" : "Opened"}!`);
                setCloseSnackbarOpen(true);
        });
    }

    const handleViewResultsClick = (questionnaire: Questionnaire) => {
        navigate(`/questionnaires/admin/view/${questionnaire.id}`, { replace: true });
    }

    return (
        <div>
            <GridList cols={2}>
                {userContext.user?.questionnaires.map((questionnaire) =>
                    <GridListTile key={questionnaire.id}>
                        <QuestionnaireCard questionnaire={questionnaire} onCardClick={handleCardClick}
                                           onCloseQuestionnaire={closeQuestionnaire} onViewResultsClick={handleViewResultsClick} />
                    </GridListTile>
                ) ?? <Box/>}
            </GridList>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={closeSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={closeSnackbarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );

}