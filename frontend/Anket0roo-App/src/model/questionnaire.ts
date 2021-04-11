import {IdModel} from "./id_model";
import {Expose} from "class-transformer";
import {QuestionnaireQuestionResponse} from "./questionnaire_question_res";
import {QuestionnaireQuestion} from "./questionnaire_question";

export class Questionnaire<T extends QuestionnaireQuestion = QuestionnaireQuestionResponse> extends IdModel {
    @Expose()
    name: string;
    @Expose()
    closed: boolean;
    @Expose()
    public: boolean;
    @Expose()
    questionnaireQuestions: T[];
    @Expose()
    authorId: number;

    constructor(name: string, closed: boolean, isPublic: boolean, questionnaireQuestion: T[], authorId: number, id?: number) {
        super(id);
        this.name = name;
        this.closed = closed;
        this.public = isPublic;
        this.questionnaireQuestions = questionnaireQuestion;
        this.authorId = authorId;
    }
}