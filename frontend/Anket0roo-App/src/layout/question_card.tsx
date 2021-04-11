import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {mainTheme} from "../theme/main_theme";
import {Question} from "../model/question";
import {
    Box,
    CardMedia,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    GridList,
    GridListTile,
    Radio,
    RadioGroup
} from "@material-ui/core";
import {QuestionnaireQuestionResponse} from "../model/questionnaire_question_res";
import {questionRegex} from "../util/question_image_regex";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        height: 300,
        maxHeight: 400,
    },
    media: {
        maxHeight: 150,
        width: 120,
    },
    bundle: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        backgroundColor: mainTheme.palette.background.paper,
    },
    formControl: {
        margin: mainTheme.spacing(3),
    },
    radioGroup: {
        minHeight: 100,
    },
    checkboxGroup: {
        minHeight: 100,
    },
    question: {
        padding: mainTheme.spacing(1)
    }
});

interface InputCardProps {
    handleMandatoryChange: (question: QuestionnaireQuestionResponse) => void;
    handleMoreThanOneAnswerChange: (question: QuestionnaireQuestionResponse) => void;
    mandatory: boolean;
    moreThanOneAnswer: boolean;
}

interface FillCardProps {
    onAnswerSelected: (answerId: number) => void
}

interface OutlinedCardProps {
    questionnaireQ: QuestionnaireQuestionResponse;
    fillAnswers: boolean;
    inputCardProps?: InputCardProps;
    fillCardProps?: FillCardProps;
    className?: string;
    onCardClick?: (event: any) => void;
    id?: string;
}

// a bit coupled like a Flutter widget but it'll do
export const QuestionCard: React.FC<OutlinedCardProps> = ({ questionnaireQ, fillAnswers,
                                                              inputCardProps, fillCardProps, className,
                                                              id, onCardClick }: OutlinedCardProps) => {
    const classes = useStyles();

    const [pressState, setPressState] = useState(new Map<number, boolean>(questionnaireQ.question.answers
        .map((answer) => { return [answer.id, false]; })));

    const [groupValue, setGroupValue] = useState('');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const answerId = (event.target as HTMLInputElement).value;
        setGroupValue(answerId);
        fillCardProps?.onAnswerSelected(parseInt(answerId));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const answerId = parseInt(event.target.name);
        pressState.set(answerId, event.target.checked);
        setPressState(pressState);
        fillCardProps?.onAnswerSelected(answerId);
    };

    const imageUrls = questionnaireQ.question.question.match(questionRegex);
    const filteredQuestion = questionnaireQ.question.question.replace(questionRegex, "");

    console.log(imageUrls);
    return (
        <Card id={id} onClick={(event) => {
            const targetId = event.currentTarget.id;
            if(onCardClick != null && targetId == id) {
                onCardClick(event);
            }
        }} className={className != null ? className : classes.root} variant="outlined">
            <CardContent>
                <div className={classes.bundle}>
                    <FormControl component="fieldset">
                        <FormLabel className={classes.question} component="legend">{filteredQuestion}</FormLabel>
                        {imageUrls && <CardMedia
                            title={filteredQuestion} >
                            <img className={classes.media}
                                  src={encodeURI(imageUrls[0])} alt={"Image not found!"} />
                        </CardMedia>}

                        {!questionnaireQ.moreThanOneAnswer ? <RadioGroup row={true}
                                                                         name="question-answers"
                                                                         className={classes.radioGroup}
                                                                         value={groupValue} onChange={handleRadioChange}>
                            {questionnaireQ.question.answers.map((answer) => {
                                return <FormControlLabel disabled={!fillAnswers} value={answer.id.toString()}
                                                         control={<Radio required={fillAnswers} />} label={answer.answer} />
                            })}
                        </RadioGroup> : <FormGroup className={classes.checkboxGroup} row={true}>
                            {questionnaireQ.question.answers.map((answer) => {
                                return <FormControlLabel
                                    control={<Checkbox disabled={!fillAnswers} checked={pressState.get(answer.id)}
                                                       onChange={handleCheckboxChange} name={answer.id.toString()} />}
                                    label={answer.answer}
                                />
                            })}
                        </FormGroup>}
                    </FormControl>

                    {inputCardProps && <Box>
                        <FormControlLabel label={"Mandatory?"}  onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            inputCardProps.handleMandatoryChange(questionnaireQ); }} control={
                            <Checkbox checked={inputCardProps.mandatory}/>} />
                        <FormControlLabel label={"Can have more than one answer?"} onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            inputCardProps.handleMoreThanOneAnswerChange(questionnaireQ); } } control={
                            <Checkbox checked={inputCardProps.moreThanOneAnswer} />} />
                    </Box>}
                </div>
            </CardContent>
        </Card>
    );
}