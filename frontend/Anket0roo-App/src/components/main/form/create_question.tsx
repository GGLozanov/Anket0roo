import * as React from "react";
import {useEffect, useState} from "react";
import ImageUploader from "react-images-upload";
import { FixedSizeList } from "react-window";
import {Button, Card, CardContent, FormControl, Grid, List, makeStyles, TextField} from "@material-ui/core";
import {Controller, FieldArrayWithId, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {FieldArrayPath} from "react-hook-form/dist/types/utils";
import { Question } from "../../../model/question";
import {Answer} from "../../../model/answer";
import {useUserContext} from "../../../context/user_context";
import {questionService} from "../../../service/question_service";
import {useAuthContext} from "../../../context/auth_context";
import {plainToClass} from "class-transformer";
import {User} from "../../../model/user";
import {useNavigate} from "react-router";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    add: {
        margin: theme.spacing(2),
        flex: 1,
        width: "50%",
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
    const userContext = useUserContext();
    const authContext = useAuthContext();
    const navigate = useNavigate();

    const [chosenPicture, setChosenPicture] = useState(null);
    const [error, setError] = useState(null);

    const classes = useStyles();

    const form = useForm<CreateQuestionFormProps>({ defaultValues: { question: "", answers: [{ answer: "" }] } });
    // @ts-ignore
    const { fields, remove, append } = useFieldArray<CreateQuestionFormProps>({ control: form.control, name: "answers" });

    const onDrop = (files: File[], pictures: string[]) => {
        setChosenPicture(new File([files[0]], encodeURIComponent(files[0].name), { type: files[0].type }));
    };

    const onSubmit = (data: CreateQuestionFormProps) => {
        console.log(JSON.stringify(data));
        console.log(`User auth id: ${userContext.user?.id}`);
        const question = new Question(data.question, data.answers
            .map((ans) => new Answer(ans.answer, null)), userContext.user.id, null);
        questionService.createQuestion(authContext, question, chosenPicture)
            .catch((error) => {
                setError("Something went wrong! Please, fill out the information again!");
            })
            .then((response) => {
                if(response && response.data) {
                    userContext.addQuestion(plainToClass(Question, response.data, {excludeExtraneousValues: true}));
                    navigate("/profile", { replace: true });
                } else {
                    setError("Invalid response received from server! Please, try again!");
                }
            });
        // success => remove errors & add question to user
    }

    const errors = form.formState.errors;
    console.log(JSON.stringify(fields))

    return (
        <div>
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
                                    maxLength: 50
                                }}
                            />
                        </FormControl>

                        <ImageUploader
                            withIcon={true}
                            onChange={onDrop}
                            imgExtension={[".jpg", ".png"]}
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
                                            maxLength: 40
                                        }}
                                    />
                                    {index != 0 &&
                                    <Button
                                        variant="contained"
                                        className={classes.add}
                                        color="primary"
                                        onClick={(event) =>
                                            remove(fields.findIndex((it) => it.id == item.id))}>Remove Answer</Button>}
                                    {index == fields.length - 1 &&
                                    <Button
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
            {error && <div>{error}</div>}
        </div>
    );
}