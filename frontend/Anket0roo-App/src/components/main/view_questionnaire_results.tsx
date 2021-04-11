import * as React from "react";
import {useNavigate, useParams} from "react-router";
import {Box, Typography} from "@material-ui/core";
import {Chart} from "react-google-charts";
import {useEffect, useState} from "react";
import {questionnaireService} from "../../service/questionnaire_service";
import {UserAnswerResponse} from "../../model/user_answer_res";
import {plainToClass} from "class-transformer";
import {useAuthContext} from "../../context/auth_context";
import {Questionnaire} from "../../model/questionnaire";
import {Answer} from "../../model/answer";
import {Question} from "../../model/question";
import flatten from "../../util/flatten";

export const ViewQuestionnaireResults: React.FC = () => {
    let { tokenUrl } = useParams();

    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswerResponse[]>(null);

    useEffect(() => {
        // TODO: Code dup
        questionnaireService.getQuestionnaireForTokenUrl(authContext, tokenUrl)
            .catch((error) => {
                console.log(error);
                navigate("/profile", { replace: true });
            }).then((response) => {
                if(response) {
                    console.log(response?.data);
                    setQuestionnaire(plainToClass(Questionnaire, response.data, { excludeExtraneousValues: true }));
                } else {
                    navigate("/profile", { replace: true });
                }
        });

        questionnaireService.getUserAnswersWithTokenUrl(authContext, tokenUrl)
            .catch((error) => {
                console.log(error);
                navigate("/profile", { replace: true });
            }).then((response) => {
               if(response) {
                   // @ts-ignore
                   setUserAnswers(plainToClass(UserAnswerResponse, response.data, { excludeExtraneousValues: true }));
               }
            });
    }, []);

    // OVERHEAD...
    // IT'S OVER 9000!
    // No, SERIOUSLY, can't find a single resource on how I might overload an equality/indexing operator for using an object as a key
    // apparently hashes for objects do not exist here! Dangit, I want Java back!
    const mappedUserAnswers = userAnswers?.reduce(function(map, userAnswer) {
        map.set(userAnswer.question.id, (map.get(userAnswer.question.id) ?? []).concat(userAnswer.answer));
        return map;
    }, new Map<number, Answer[]>())

    console.log(`Data: ${JSON.stringify([['Question', 'Times Answered'], ...(mappedUserAnswers ? Array.from(mappedUserAnswers)
        .map(([questionId, answers]) => [questionnaire?.questionnaireQuestions?.find((qq) => qq.question.id == questionId), answers.length]) : [])])}`);

    // same as FillQuestionnaire - check if token valid, bla bla; reroute otherwise
    return (
        <div>
            <Typography variant={"h3"}>
                {questionnaire?.name ? `Results for ${questionnaire?.name}` : `Results for...`}
            </Typography>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="BarChart"
                loader={<div>Loading Data...</div>}
                options={{
                    title: 'Questions and amount of times answered',
                    chartArea: { width: '50%' },
                    hAxis: {
                        title: 'Total Answers',
                        minValue: 0,
                    },
                    vAxis: {
                        title: 'Question',
                    },
                }}
                data={
                    mappedUserAnswers ? [['Question', 'Times Answered'], ...Array.from(mappedUserAnswers)
                        .map(([questionId, answers]) => [questionnaire?.questionnaireQuestions?.find((qq) =>
                            qq.question.id == questionId), answers.length])] : []
                }
            />
        </div>
    );
}