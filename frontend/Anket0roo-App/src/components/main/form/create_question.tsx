import * as React from "react";
import {useEffect, useState} from "react";
import ImageUploader from "react-images-upload";
import { FixedSizeList } from "react-window";
import {Button, Card, CardContent, FormControl, List, makeStyles, TextField} from "@material-ui/core";
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
}));

interface CreateQuestionFormProps {
    question: string;
    answers: string[];
}

export const CreateQuestion: React.FC = () => {
    const [chosenPicture, setChosenPicture] = useState(null);
    const classes = useStyles();

    const form = useForm<CreateQuestionFormProps>({ defaultValues: { question: "", answers: [""] } });
    // @ts-ignore
    const { fields, remove, append } = useFieldArray({ control: form.control, name: "answers" });

    const onDrop = (files: File[], pictures: string[]) => {
        setChosenPicture(files[0]);
    };

    const onSubmit = (data: CreateQuestionFormProps) => {
        console.log(JSON.stringify(data));
    }

    const errors = form.formState.errors;
    const question = form.watch("question");

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
                                    {...form.register("question")}
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
                        console.log(form.getValues("answers")?.[index]);
                        console.log(JSON.stringify(item));
                        // TODO: Null fallback w/ properly typed (QuestionCreateProps)
                        const defaultValue =
                            (form.getValues("answers") ?? [null])?.[index] // ?? item.answers[index];

                        return (
                            <div>
                                <Controller
                                    render={({ field }) => <TextField
                                        {...field}
                                        margin="normal"
                                        name={`answers[${index}]`}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id={`${fields[index].id}`}
                                        label={`Answer ${index + 1}`}
                                        helperText={errors.answers[index] ? errors.answers[index].message : null}
                                        autoComplete="name"
                                        error={errors.answers[index] !== undefined} />
                                    }
                                    name={`answers.${index}` as `answers.${number}`}
                                    defaultValue={defaultValue}
                                    control={form.control}
                                    rules={{
                                        required: true,
                                        maxLength: 20
                                    }}
                                />
                                {index == fields.length - 1 &&
                                <Button
                                     fullWidth
                                     variant="contained"
                                     color="primary"
                                     className={classes.submit}
                                     onClick={(event) =>
                                         append({ answer: "", question: question ?? ""})}>Add Answer</Button>}
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