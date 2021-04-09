import * as React from "react";
import {useEffect, useState} from "react";
import ImageUploader from "react-images-upload";
import { FixedSizeList } from "react-window";
import {Button, Card, CardContent, FormControl, Grid, List, makeStyles, TextField} from "@material-ui/core";
import {Controller, FieldArrayWithId, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {FieldArrayPath} from "react-hook-form/dist/types/utils";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    add: {
        margin: theme.spacing(1, 0, 2),
    },
    answerField: {
        display: 'flex',
    }
}));

interface AnswerFormProps {
    answer: string;
}

interface CreateQuestionFormProps {
    question: string;
    answers: AnswerFormProps[];
}

export const CreateQuestion: React.FC = () => {
    const [chosenPicture, setChosenPicture] = useState(null);
    const classes = useStyles();

    const form = useForm<CreateQuestionFormProps>({ defaultValues: { question: "", answers: [{ answer: "" }] } });
    // @ts-ignore
    const { fields, remove, append } = useFieldArray<CreateQuestionFormProps>({ control: form.control, name: "answers" });

    const onDrop = (files: File[], pictures: string[]) => {
        setChosenPicture(files[0]);
    };

    const onSubmit = (data: CreateQuestionFormProps) => {
        console.log(JSON.stringify(data));

        // success => remove errors & add question to user
    }

    const errors = form.formState.errors;
    console.log(JSON.stringify(fields))

    return (
        <Card>
            <CardContent>
                <form className={classes.form} onSubmit={form.handleSubmit(onSubmit)}>
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name="question"
                            render={ ({ field }) =>
                                <TextField
                                    {...field}
                                    margin="normal"
                                    name="question"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="question"
                                    label="Question"
                                    helperText={errors.question ? errors.question.message : null}
                                    autoComplete="name"
                                    error={errors.question !== undefined}
                                />
                            }
                            control={form.control}
                            defaultValue=""
                            rules={{
                                required: true,
                                maxLength: 20
                            }}
                        />
                    </FormControl>

                    <ImageUploader
                        withIcon={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                        maxFileSize={5242880}
                        singleImage={true}
                        label={"Upload an image for the question!"}
                    />

                    {fields.map((item,
                                  index: number) => {
                        console.log(JSON.stringify(item));
                        // TODO: Null fallback w/ properly typed (QuestionCreateProps)
                        const values = form.getValues("answers");
                        let defaultValue =
                            values ? values[index].answer :
                                (item.answer ? item.answer : "");

                        console.log(errors.answers);
                        console.log(index);
                        return (
                            <div className={classes.answerField}>
                                <Controller
                                    render={({ field }) => <TextField
                                        {...field}
                                        margin="normal"
                                        name={`answers[${index}].answer`}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id={`${fields[index]?.id}`}
                                        label={`Answer ${index + 1}`}
                                        helperText={errors.answers?.[index] ? errors.answers[index].answer.message : null}
                                        autoComplete="name"
                                        error={errors.answers?.[index]?.answer !== undefined} />
                                    }
                                    name={`answers.${index}.answer` as `answers.${number}.answer`}
                                    defaultValue={defaultValue}
                                    control={form.control}
                                    rules={{
                                        required: true,
                                        maxLength: 20
                                    }}
                                />
                                {index != 0 &&
                                <Button
                                    fullWidth
                                    variant="contained"
                                    className={classes.add}
                                    color="primary"
                                    onClick={(event) =>
                                        remove(fields.indexOf(item.id))}>Remove Answer</Button>}
                                {index == fields.length - 1 &&
                                <Button
                                     fullWidth
                                     variant="contained"
                                     className={classes.add}
                                     color="primary"
                                     onClick={(event) =>
                                         append({ answer: "" })}>Add Answer</Button>}
                            </div>
                        );
                    })}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create Question
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}