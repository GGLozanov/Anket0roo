import * as React from "react";
import {useParams} from "react-router";

export const FillQuestionnaire: React.FC = () => {
    let urlParams = useParams();

    // check if token valid, bla bla; reroute otherwise
}

// makes a request to the /submit endpoint upon filling request
// can take in {tokenUrl} parameter that signifies the questionnaire being filled out; otherwise gets a questionnaire directly passed in