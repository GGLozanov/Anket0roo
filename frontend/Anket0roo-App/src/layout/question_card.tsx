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

const useStyles = makeStyles({
    root: {
        minWidth: 275,
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

interface OutlinedCardProps {
    questionnaireQ: QuestionnaireQuestion
}

// TODO: Keep track of state of press and etc.
// TODO: Add check for mandatory (not even sure how tbh; probably not in this context-unarware component)
export const QuestionCard: React.FC<OutlinedCardProps> = ({ questionnaireQ }: OutlinedCardProps) => {
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

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <div className={classes.bundle}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{questionnaireQ.question.question}</FormLabel>
                        {!questionnaireQ.moreThanOneAnswer ? <RadioGroup name="question-answers" value={groupValue} onChange={handleRadioChange}>
                            {questionnaireQ.question.answers.map((answer) => {
                                return <FormControlLabel value={answer.answer} control={<Radio />} label={answer.answer} />
                            })}
                        </RadioGroup> : <FormGroup>
                            {questionnaireQ.question.answers.map((answer) => {
                                return <FormControlLabel
                                    control={<Checkbox checked={pressState.get(answer.id)}
                                                       onChange={handleCheckboxChange} name={answer.id.toString()} />}
                                    label={answer.answer}
                                />
                            })}
                        </FormGroup>}
                    </FormControl>
                </div>
            </CardContent>
        </Card>
    );
}