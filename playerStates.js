const playerStates = {
    IDLING: 0,
    MOVETOTARGET: 1,
    MOVETOFORMATION: 2,
}

class PlayerState {
    constructor(state) {
        this.state = state;
    }
}

export class Idling extends PlayerState {
    constructor(hero) {
        super('IDLING');
        this.hero = hero;
    }

    enter() {

    }

    handler() {
        
    }
}

export class MoveToTarget extends PlayerState {
    constructor(hero) {
        super('MOVE TO TARGET');
        this.hero = hero;
    }

    enter() {
        
    }

    handler() {
        
    }
}

export class MoveToFormation extends PlayerState {
    constructor(hero) {
        super('MOVE TO FORMATION');
        this.hero = hero;
    }

    enter() {
        
    }

    handler() {
        
    }
}