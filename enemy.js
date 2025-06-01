export class Enemy {
    constructor(game) {
        this.game = game;

        //ints
        this.fury = 0;
        this.furyMax = 100;
        this.vectorSpeed = 10;

        //bools
        this.hasInitial = false;
        this.hasCombo = false;
        this.hasFinisher = false;

        //strings
        this.type = 'enemy';
        this.column = 'front';
        this.row = 'middle';
    }
}
