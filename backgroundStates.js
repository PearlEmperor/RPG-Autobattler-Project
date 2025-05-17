import * as Background from "./background.js";

const backgroundStates = {
    FOREST1: 0,
    MAIN_MENU_STATE: 1,
}

class BackgroundState {
    constructor(state) {
        this.state = state;
        // this.fps = 60;
        // this.frameInterval = Math.floor(1000/this.fps);
        // this.frameTimer = 0;
    }

    handler() {

    }
}

export class ForestState1 extends BackgroundState {
    constructor(game) {
        super('FOREST 1');
        this.game = game;
    }

    enter() {
        this.game.background = new Background.Forest1(this.game);
    }

    handler() {
        
    }
}

export class MainMenuState extends BackgroundState {
    constructor(game) {
        super('MAIN MENU STATE');
        this.game = game;
    }

    enter() {

    }

    handler() {
        
    }
}