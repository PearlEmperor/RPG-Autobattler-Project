import { Enemy } from "./enemy.js";

class BasicEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.health = 50;
        this.maxHealth = 50;
        this.physicalAttack = 0;
        // this.magicAttack = 50;
        this.physicalDefense = 50;
        this.magicDefense = 50;
        this.agility = 50;
    }
}

export class EnemyWarrior extends BasicEnemy {
    constructor(game) {
        super();
        this.game = game;
        this.combatType = 'warrior';
    }
}

export class GoblinFighter extends EnemyWarrior {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.width = 128;
        this.height = 128;
        this.x = this.game.width + this.width;
        this.y = this.game.height - this.height - 80;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 64;
        this.spriteY = 0;
        this.image = document.getElementById('enemySprites1');
        this.formationX = this.game.width - this.width;
        this.formationY = this.game.height - this.height - 80;
    }
    
    initialList() {
        
    }

    attackInitial() {

    }
}
