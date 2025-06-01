import { Warrior } from "/hero.js";
import * as System from "/systems.js";

export class Paladin extends Warrior {
    constructor(game) {
        super();
        this.game = game;
        this.x = 0;
        this.y = this.game.height - this.height - 80;
        this.formationX = 0;
        this.formationY = this.game.height - this.height - 80;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 192;
        this.spriteY = 32;
        this.image = document.getElementById('paladin');
    }

    initialList(gameState) {
        System.initialList1x3(this, gameState, this.game.enemies);
    }

    attackInitial(gameState) {
        gameState.targetList.forEach(target => {
            target.health -= this.physicalAttack;
            // target.health -= (this.physicalAttack + (this.attackInitialFlat * this.physicalAttackMult)) * this.attackInitialMod;
        });
    }

    comboList() {
        
    }

    attackCombo() {

    }

    finisherList() {
        
    }

    attackFinisher() {

    }
}
