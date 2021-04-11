import * as React from "react";
import {
    Box, Button,
    Card,
    CardContent,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, FormControlLabel,
    GridList,
    GridListTile,
    makeStyles, Slide,
    TextField, Theme, Typography
} from "@material-ui/core";
import {useUserContext} from "../../../context/user_context";
import {useAuthContext} from "../../../context/auth_context";
import {useNavigate} from "react-router";
import {Controller, useForm} from "react-hook-form";
import {MouseEventHandler, useEffect, useState} from "react";
import {QuestionCard} from "../../../layout/question_card";
import {Question} from "../../../model/question";
import {questionnaireService} from "../../../service/questionnaire_service";
import {Questionnaire} from "../../../model/questionnaire";
import {TransitionProps} from "@material-ui/core/transitions";
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import {ref} from "yup";
import {plainToClass} from "class-transformer";
import {QuestionnaireQuestionRequest} from "../../../model/questionnaire_question_req";
import {QuestionnaireQuestionResponse} from "../../../model/questionnaire_question_res";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "100%",
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    adminUrl: {
        color: "#ffcccb"
    },
    userUrl: {
        color: "#FFDF00"
    },
    selectedTile: {
        backgroundColor: theme.palette.primary.main,
        minWidth: 275,
        minHeight: 200,
        height: "100%"
    },
    deselectedTile: {
        backgroundColor: "#FFFFFF",
        minWidth: 275,
        minHeight: 200,
        height: "100%"
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface CreateQuestionnaireFormProps {
    name: string;
}

const DialogTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateQuestionnaire: React.FC = () => {
    const userContext = useUserContext();
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const classes = useStyles();

    const MemoQuestionCard = React.memo(
        QuestionCard,
        ((prevProps, nextProps) =>
                prevProps.questionnaireQ.question.id == nextProps.questionnaireQ.question.id &&
                prevProps.questionnaireQ.moreThanOneAnswer == nextProps.questionnaireQ.moreThanOneAnswer &&
                prevProps.questionnaireQ.mandatory == nextProps.questionnaireQ.mandatory &&
            ((document.getElementById(nextProps.questionnaireQ.question.id.toString())?.className ==
                        classes.deselectedTile && !selectedQuestionnaireQuestionsIds
                    .includes(nextProps.questionnaireQ.question.id)) ||
                ((document.getElementById(nextProps.questionnaireQ.question.id.toString())?.className ==
                    classes.selectedTile && selectedQuestionnaireQuestionsIds.includes(nextProps.questionnaireQ.question.id)))
        )
    )); // huh, this memoization API is actually pretty cool. Go DP: nice one, React!

    const { handleSubmit, control, reset, formState: { errors } } = useForm<CreateQuestionnaireFormProps>();

    const [questionnaireQuestions, setQuestionnaireQuestions] =
        useState<QuestionnaireQuestionResponse[]>(userContext.user?.questions?.map((question) =>
            new QuestionnaireQuestionResponse(question, false, false)));
    console.log(questionnaireQuestions);
    const [selectedQuestionnaireQuestionsIds, setSelectedQuestionnaireQuestionsIds] = useState<number[]>([]);

    const [isPublic, setIsPublic] = useState(false);

    const [urlDialogOpen, setUrlDialogOpen] = useState(false);
    const [error, setError] = useState(null);

    const [userGenUrl, setUserGenUrl] = useState(null);
    const [adminGenUrl, setAdminGenUrl] = useState(null);

    useEffect(() => {
        setQuestionnaireQuestions(userContext.user?.questions?.map((question) =>
            new QuestionnaireQuestionResponse(question, false, false)));
    }, [userContext.user]);

    console.log(`Chosen questionnaireQuestions IDS: ${JSON.stringify(selectedQuestionnaireQuestionsIds)}`);
    console.log(`questionnaireQuestions: ${JSON.stringify(questionnaireQuestions)}`);

    const onSubmit = (data: CreateQuestionnaireFormProps) => {
        console.log(data);
        const questionnaire = new Questionnaire<QuestionnaireQuestionRequest>(data.name, false, isPublic,
            questionnaireQuestions.filter((qq) =>
                selectedQuestionnaireQuestionsIds.includes(qq.question.id))
                .map((qq) =>
                    new QuestionnaireQuestionRequest({ questionId: qq.question.id },
                        qq.mandatory, qq.moreThanOneAnswer)),
            userContext.user.id, null);
        console.log("Sending questionnaire: " + JSON.stringify(questionnaire));

        questionnaireService.createQuestionnaire(authContext, questionnaire)
            .catch((error) => {
                console.log(error);
                reset({ name: '' },
                    { keepErrors: true, keepDirty: true });
                setError("Something went wrong with creating your questionnaire! Please try again or login again!");
            }).then((response) => {
                if(response && response.data && response.data.uniqueUrl && response.data.uniqueAdminUrl && response.data.questionnaire) {
                    // display unique URLs in dialog & reroute
                    userContext.addQuestionnaire(plainToClass(Questionnaire,
                        response.data.questionnaire, { excludeExtraneousValues: true }));
                    setAdminGenUrl(response.data.uniqueAdminUrl);
                    setUserGenUrl(response.data.uniqueUrl);
                    setUrlDialogOpen(true);
                } else {
                    setError("Invalid response received!");
                }
        })
    }

    const handleMoreThanOneAnswerChange = (questionnaireQ: QuestionnaireQuestionResponse) => {
        // efficiency 100
        setQuestionnaireQuestions(questionnaireQuestions.map((questionnaireQuestion) => {
           if(questionnaireQuestion.question.id == questionnaireQ.question.id) {
               return { ...questionnaireQuestion, moreThanOneAnswer: !questionnaireQ.moreThanOneAnswer };
           }
           return questionnaireQuestion;
        }));
    }

    const handleMandatoryChange = (questionnaireQ: QuestionnaireQuestionResponse) => {
        setQuestionnaireQuestions(questionnaireQuestions.map((questionnaireQuestion) => {
            if(questionnaireQuestion.question.id == questionnaireQ.question.id) {
                return { ...questionnaireQuestion, mandatory: !questionnaireQ.mandatory };
            }
            return questionnaireQuestion;
        }));
    }

    const handleDialogClose = (event: any) => {
        setUrlDialogOpen(false);
        navigate("/profile", { replace: true });
    }

    return (
        <Card>
            <CardContent>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name="name"
                            render={ ({ field }) =>
                                <TextField
                                    {...field}
                                    margin="normal"
                                    name="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    helperText={errors.name ? errors.name.message : null}
                                    autoComplete="name"
                                    error={errors.name !== undefined}
                                />
                            }
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                maxLength: 50
                            }}
                        />
                    </FormControl>
                </form>

                <div className={classes.root}>
                    <GridList className={classes.gridList} cellHeight={200} cols={2}>
                        {questionnaireQuestions?.map((questionnaireQuestion) =>
                            <GridListTile>
                                <MemoQuestionCard id={questionnaireQuestion.question.id.toString()}
                                        className={selectedQuestionnaireQuestionsIds.includes(questionnaireQuestion.question.id) ?
                                    classes.selectedTile : classes.deselectedTile}
                                      onCardClick={(event: any) => {
                                          console.log("Clicked grid list tile");
                                          const questionIndex = selectedQuestionnaireQuestionsIds
                                              .indexOf(questionnaireQuestion.question.id);
                                          console.log(`Q index: ${questionIndex}`);
                                          if(questionIndex >= 0) {
                                              console.log("Removing question from selected");
                                              // remove
                                              setSelectedQuestionnaireQuestionsIds((questionIds) =>
                                                  questionIds.filter((qId) => qId != questionnaireQuestion.question.id));
                                              // OVERHEAD 9000
                                          } else {
                                              console.log("Adding question from selected");
                                              // append
                                              setSelectedQuestionnaireQuestionsIds((questionIds) => [...questionIds, questionnaireQuestion.question.id]);
                                          }
                                      }}
                                      questionnaireQ={questionnaireQuestion} fillAnswers={false}
                                          inputCardProps={{handleMandatoryChange: handleMandatoryChange,
                                              handleMoreThanOneAnswerChange: handleMoreThanOneAnswerChange,
                                              mandatory: questionnaireQuestion.mandatory,
                                              moreThanOneAnswer: questionnaireQuestion.moreThanOneAnswer}} />
                            </GridListTile>)
                        }
                    </GridList>
                </div>
                <div>
                    <FormControlLabel control={
                        <Checkbox checked={isPublic} onChange={(event) => setIsPublic(!isPublic)} />
                    } label={"Do you want your questionnaire to be public?"} />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(event) => handleSubmit(onSubmit)()}
                >
                    Create Questionnaire
                </Button>
            </CardContent>
            <Dialog
                open={urlDialogOpen}
                TransitionComponent={DialogTransition}
                keepMounted
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"These are your uniquely generated URLs for the questionnaire:"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        This is the URL for viewing the results:
                    </DialogContentText>
                    <Typography variant={"h5"} className={classes.adminUrl}>
                        {adminGenUrl}
                    </Typography>
                    <DialogContentText id="alert-dialog-slide-description">
                        And this is the URL for sharing the questionnaire with other people:
                    </DialogContentText>
                    <Typography variant={"h5"} className={classes.userUrl}>
                        {userGenUrl}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            {error && <div>{error}</div>}
        </Card>
    );
}