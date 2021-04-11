import {Expose} from "class-transformer";
import {Question} from "./question";
import {QuestionnaireQuestion} from "./questionnaire_question";

interface QuestionnaireQuestionId {
    questionId: number;
    questionnaireId?: number;
}

export class QuestionnaireQuestionRequest extends QuestionnaireQuestion {
    @Expose()
    questionnaireQuestionId: QuestionnaireQuestionId;

    constructor(questionnaireQuestionId: QuestionnaireQuestionId, mandatory: boolean, moreThanOneAnswer: boolean) {
        super(mandatory, moreThanOneAnswer);
        this.questionnaireQuestionId = questionnaireQuestionId;
    }
}