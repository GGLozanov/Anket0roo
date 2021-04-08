import * as React from "react";
import {Questionnaire} from "../model/questionnaire";
import CardContent from "@material-ui/core/CardContent";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    makeStyles,
    Radio,
    RadioGroup, Typography
} from "@material-ui/core";
import {QuestionnaireProps} from "../util/questionnaire_props";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

interface QuestionnaireCardProps {
    questionnaire: Questionnaire;
    onCardClick?: (questionnaire: Questionnaire) => void;
}

export const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ questionnaire, onCardClick }: QuestionnaireCardProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined" onClick={(event) => {
            event.preventDefault();
            onCardClick(questionnaire);
            return event;
        }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {questionnaire.name}
                </Typography>
                <div>
                    <FormControlLabel
                        control={<Checkbox checked={!questionnaire.closed} disabled inputProps={{ 'aria-label': 'Open' }} />}
                        label="Open"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={questionnaire.public} disabled inputProps={{ 'aria-label': 'Public' }} />}
                        label="Public"
                    />
                </div>
            </CardContent>
        </Card>
    );
}