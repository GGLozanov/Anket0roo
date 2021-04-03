import {Expose} from "class-transformer";

export class IdModel {
    @Expose()
    id: number;

    constructor(id: number) {
        this.id = id;
    }
}
