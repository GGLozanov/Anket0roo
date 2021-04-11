import {Expose} from "class-transformer";

export class UserAnswerRequest {
    @Expose()
    questionnaireId: number;
    @Expose()
    questionId: number;
    @Expose()
    answerId: number;

    constructor(questionnaireId: number, questionId: number, answerId: number) {
        this.questionId = questionId;
        this.questionnaireId = questionnaireId;
        this.answerId = answerId;
    }
}