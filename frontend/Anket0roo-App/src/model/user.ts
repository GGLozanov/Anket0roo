import {IdModel} from "./id_model";
import {Question} from "./question";
import {Questionnaire} from "./questionnaire";
import {Expose} from "class-transformer";

export class User extends IdModel {
    @Expose()
    username: string;
    @Expose()
    email: string;
    @Expose()
    questionnaires: Questionnaire[];
    @Expose()
    questions: Question[];

    constructor(id: number, username: string, email: string, questionnaires: Questionnaire[], questions: Question[]) {
        super(id);
        this.username = username;
        this.email = email;
        this.questionnaires = questionnaires;
        this.questions = questions;
    }
}