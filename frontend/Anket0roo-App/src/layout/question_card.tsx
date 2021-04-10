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
import {QuestionnaireQuestion} from "../model/questionnaire_question";
import {questionRegex} from "../util/question_image_regex";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    media: {
        height: 100,
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
});

interface InputCardProps {
    handleMandatoryChange: (question: QuestionnaireQuestion) => void;
    handleMoreThanOneAnswerChange: (question: QuestionnaireQuestion) => void;
    mandatory: boolean;
    moreThanOneAnswer: boolean;
}

interface OutlinedCardProps {
    questionnaireQ: QuestionnaireQuestion;
    fillAnswers: boolean;
    inputCardProps?: InputCardProps;
    className?: string;
    onCardClick?: (event: any) => void;
    id?: string;
}

// a bit coupled like a Flutter widget but it'll do
export const QuestionCard: React.FC<OutlinedCardProps> = ({ questionnaireQ, fillAnswers,
                                                              inputCardProps, className, id, onCardClick }: OutlinedCardProps) => {
    const classes = useStyles();

    const [pressState, setPressState] = useState(new Map<number, boolean>(questionnaireQ.question.answers
        .map((answer) => { return [answer.id, false]; })));

    const [groupValue, setGroupValue] = useState('');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroupValue((event.target as HTMLInputElement).value);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        pressState.set(parseInt(event.target.name), event.target.checked);
        setPressState(pressState);
    };
    const imageUrls = questionnaireQ.question.question.match(questionRegex);
    const filteredQuestion = questionnaireQ.question.question.replace(questionRegex, "");

    console.log(imageUrls);
    return (
        <Card id={id} onClick={(event) => {
            if(onCardClick != null) {
                onCardClick(event);
            }
        }} className={className != null ? className : classes.root} variant="outlined">
            <CardContent>
                <div className={classes.bundle}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{filteredQuestion}</FormLabel>
                        {imageUrls && <CardMedia
                            className={classes.media}
                            title={filteredQuestion} >
                            <img src={encodeURI(imageUrls[0])} alt={"Image not found!"} />
                        </CardMedia>}

                        {!questionnaireQ.moreThanOneAnswer ? <RadioGroup name="question-answers" value={groupValue} onChange={handleRadioChange}>
                            {questionnaireQ.question.answers.map((answer) => {
                                return <FormControlLabel disabled={!fillAnswers} value={answer.answer} control={<Radio />} label={answer.answer} />
                            })}
                        </RadioGroup> : <FormGroup>
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
                        <FormControlLabel label={"Mandatory?"} control={
                            <Checkbox checked={inputCardProps.mandatory}
                                      onChange={(event) => {
                                          event.persist();
                                          event.stopPropagation();
                                          inputCardProps.handleMandatoryChange(questionnaireQ); }} />} />
                        <FormControlLabel label={"Can have more than one answer?"} control={
                            <Checkbox checked={inputCardProps.moreThanOneAnswer}
                                      onChange={(event) => {
                                          event.persist();
                                          event.stopPropagation();
                                          inputCardProps.handleMoreThanOneAnswerChange(questionnaireQ); } } />} />
                    </Box>}
                </div>
            </CardContent>
        </Card>
    );
}