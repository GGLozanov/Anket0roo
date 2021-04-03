import {IdModel} from "./id_model";
import {Expose} from "class-transformer";
import {QuestionnaireQuestion} from "./questionnaire_question";

export class Questionnaire extends IdModel {
    @Expose()
    name: string;
    @Expose()
    closed: boolean;
    @Expose()
    public: boolean;
    @Expose()
    questionnaireQuestions: QuestionnaireQuestion[];
    @Expose()
    authorId: number;

    constructor(id: number, closed: boolean, isPublic: boolean, questionnaireQuestion: QuestionnaireQuestion[], authorId: number) {
        super(id);
        this.closed = closed;
        this.public = isPublic;
        this.questionnaireQuestions = questionnaireQuestion;
        this.authorId = authorId;
    }
}
