import * as React from "react";
import {useParams} from "react-router";
import {Box} from "@material-ui/core";

export const FillQuestionnaire: React.FC = () => {
    const urlParams = useParams();

    // handle questionnaire not found error

    // check if token valid, bla bla; reroute otherwise
    return (
        <Box></Box>
    );
}

// makes a request to the /submit endpoint upon filling request
// can take in {tokenUrl} parameter that signifies the questionnaire being filled out; otherwise gets a questionnaire directly passed in