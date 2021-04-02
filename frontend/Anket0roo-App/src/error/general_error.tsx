import * as React from "react";
import {Paper, Typography} from "@material-ui/core";

interface ErrorProps {
    errorReason: string;
    errorCode: number;
}

// TODO: Customise/fill
export const Error: React.FC<ErrorProps> = ({errorReason, errorCode}: ErrorProps) => {
    return (
        <Paper variant="outlined" elevation={3} square >
            <Typography variant={"h2"}>{errorReason}</Typography>
            <Typography variant={"h3"}>{errorCode}</Typography>
        </Paper>
    );
};