import * as React from "react";
import {useParams} from "react-router";
import {Box} from "@material-ui/core";

export const FillQuestionnairePublic: React.FC = () => {
    const urlParams = useParams();
    // handle questionnaire not found error

    // ping questionnaire by ID
    return (
        <Box></Box>
    );
}