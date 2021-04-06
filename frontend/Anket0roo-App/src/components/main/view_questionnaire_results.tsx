import * as React from "react";
import {useParams} from "react-router";
import {Box} from "@material-ui/core";

export const ViewQuestionnaireResults: React.FC = () => {
    let urlParams = useParams();

    // same as FillQuestionnaire - check if token valid, bla bla; reroute otherwise
    return (
        <Box></Box>
    );
}