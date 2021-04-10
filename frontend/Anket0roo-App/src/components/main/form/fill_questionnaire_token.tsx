
import * as React from "react";
import {useParams} from "react-router";
import {Box} from "@material-ui/core";

export const FillQuestionnairePublic: React.FC = () => {
    const urlParams = useParams();
    // handle questionnaire not found error

    // check if token valid, bla bla; reroute otherwise
    // render fill_questionnaire component on success
    return (
        <Box></Box>
    );
}