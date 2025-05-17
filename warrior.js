import { Hero } from "/hero.js";

export class Warrior extends Hero {
    constructor(game) {
        super();
        this.game = game;
        this.combatType = 'warrior';
        this.width = 128;
        this.height = 128;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 192;
        this.spriteY = 32;
        this.x = 0;
        this.y = this.game.height - this.height - 80;
        this.image = document.getElementById('warrior1');
        this.health = 50;
        this.maxHealth = 50;
        this.physicalAttack = 0;
        this.magicAttack = 50;
        this.physicalDefense = 50;
        this.magicDefense = 50;
        this.agility = 50;
        this.formationX = 0;
        this.formationY = this.game.height - this.height - 80;
    }

    basicList() {
        //generate the targetList for attackBasic and the relevant coordinates
        if (this.frontColumnEnemies.length > 0) {
            this.targetList.push(this.frontColumnEnemies[Math.floor(Math.random() * this.frontColumnEnemies.length)]);
            this.targetList.forEach(target => {
                this.targetX = target.x - this.width;
                this.targetY = target.y;
            });
        }
        else if (this.backColumnEnemies.length > 0) {
            this.targetList.push(this.backColumnEnemies[Math.floor(Math.random() * this.backColumnEnemies.length)]);
            this.targetList.forEach(target => {
                this.targetX = target.x - this.width;
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

    initialList() {
        //use this when formation data is being set
        this.moveTargetX = 0;
        this.moveTargetY = 0;
        if (this.frontColumnEnemies.length > 0) {
            this.targetList = this.frontColumnEnemies;
        }
        else if (this.frontColumnEnemies.length == 0) {
            this.targetList = this.backColumnEnemies;
        }
        this.targetList.forEach(target => {
            this.moveTargetX += target.x;
            this.moveTargetY += target.y;
        });
        this.moveTargetX, this.moveTargetY /= this.targetList.length;
        //this.targetList = this.frontRowEnemies[Math.floor(Math.random() * this.game.enemies.length)];
        //this.attackList = this.game.enemies[Math.floor(Math.random() * this.game.enemies.length)];
    }

    attackInitial() {
        this.targetList.forEach(target => {
            this.game.combatants.forEach(combatant => {
                if (target.combatantID == combatant.combatantID) {
                    combatant.health -= this.physicalAttack //multiply by skill damage modifier when created, modifier will also be used in displaying the skill
                }
            });
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