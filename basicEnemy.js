import { Enemy } from "./enemy.js";

class BasicEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.health = 50;
        this.maxHealth = 50;
        this.physicalAttack = 0;
        this.magicAttack = 50;
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

    basicList() {
        //generate the targetList for attackBasic and the relevant coordinates
        if (this.frontColumnHeroes.length > 0) {
            this.targetList.push(this.frontColumnHeroes[Math.floor(Math.random() * this.frontColumnHeroes.length)]);
            this.targetList.forEach(target => {
                this.targetX = target.x + target.width;
                this.targetY = target.y;
            });
        }
        else if (this.backColumnHeroes.length > 0) {
            this.targetList.push(this.backColumnHeroes[Math.floor(Math.random() * this.backColumnHeroes.length)]);
            this.targetList.forEach(target => {
                this.targetX = target.x + target.width;
                this.targetY = target.y;
            });
        }
    }

    attackBasic() {
        this.targetList.forEach(target => {
            target.health -= this.physicalAttack;
            if (target.health < 0) {
                target.health = 0;
            }
            this.game.combatants.forEach(combatant => {
                if (target.combatantID == combatant.combatantID) {
                    combatant.health = target.health;
                }
            });
        });
        this.battleState = 'movingToFormation';
    }
}

export class GoblinFighter extends EnemyWarrior {
    constructor(game) {
        super();
        this.game = game;
        this.width = 128;
        this.height = 128;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 64;
        this.spriteY = 0;
        this.x = this.game.width + this.width;
        this.y = this.game.height - this.height - 80;
        this.image = document.getElementById('enemySprites1');
        this.formationX = this.game.width - this.width;
        this.formationY = this.game.height - this.height - 80;
    }
    
    initialList() {
        
    }

    attackInitial() {

    }
}