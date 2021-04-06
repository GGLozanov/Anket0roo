import * as React from "react";
import {useState} from "react";
import ImageUploader from "react-images-upload";
import {Button, FormControl, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({

});

export const CreateQuestion: React.FC = () => {
    const [chosenPicture, setChosenPicture] = useState(null);
    const styles = useStyles();

    const onDrop = (files: File[], pictures: string[]) => {
        setChosenPicture(files[0]);
    };

    const onCreateQuestionButton = (event: React.MouseEvent) => {

    }

    return (
        <FormControl>
            <ImageUploader
                withIcon={true}
                onChange={onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
                singleImage={true}
            />

            <Button onClick={onCreateQuestionButton}>
            </Button>
        </FormControl>
    );
}