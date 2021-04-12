import * as React from "react";
import {Questionnaire} from "../model/questionnaire";
import CardContent from "@material-ui/core/CardContent";
import {
    Button,
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
        display: "flex",
        width: "100%",
        minWidth: "20%",
    },
});

interface QuestionnaireCardProps {
    questionnaire: Questionnaire;
    onCardClick?: (questionnaire: Questionnaire) => void;
    onCloseQuestionnaire?: (questionnaire: Questionnaire) => void;
    onViewResultsClick?: (questionnaire: Questionnaire) => void;
}

export const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ questionnaire, onCardClick,
                                                                        onCloseQuestionnaire, onViewResultsClick }: QuestionnaireCardProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined" onClick={(event) => {
            event.preventDefault();
            if(onCardClick) {
                onCardClick(questionnaire);
            }
            return event;
        }}>
            <CardContent>
                <div style={{ display: 'flex' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {questionnaire.name}
                    </Typography>
                    {onViewResultsClick && <Button onClick={(event) => {
                        event.stopPropagation();
                        onViewResultsClick(questionnaire);
                    }}>
                        View Results
                    </Button>}
                </div>
                {onCloseQuestionnaire &&
                    <Button onClick={(event) => {
                                 event.stopPropagation();
                                 onCloseQuestionnaire(questionnaire); } }>
                        {questionnaire.closed ? "Open" : "Close"}
                    </Button>}
                <div style={{ display: 'flex' }}>
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