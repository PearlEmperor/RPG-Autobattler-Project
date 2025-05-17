export class Hero {
    constructor(game) {
        this.game = game;
        this.type = 'hero';
        this.fury = 0;
        this.furyMax = 100;
        this.comboCooldown = 0;
        this.finisherCooldown = 0;
        this.vectorSpeed = 10;
        this.targetList = [];
        this.battleState = 'movingToTarget';
        this.column = 'front';
        this.row = 'middle';

        //used to check if the attack loop is over so the next combatant/attack loop can be triggered
        this.basicDone = 'no';
        this.initialDone = 'no';
        this.comboDone = 'no';
        this.finisherDone = 'no';
    }

    draw(context) {
        context.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    sortTargetList() {
        //separates enemies into relevant rows/columns for use in targeting
        this.frontColumnEnemies = [];
        this.backColumnEnemies = [];
        this.topRowEnemies = [];
        this.middleRowEnemies = [];
        this.bottomRowEnemies = [];
        this.game.enemies.forEach(enemy => {
            if (enemy.column == 'front') {
                this.frontColumnEnemies.push(enemy);
            }
            else if (enemy.column == 'back') {
                this.backColumnEnemies.push(enemy);
            }
            if (enemy.row == 'top') {
                this.topRowEnemies.push(enemy);
            }
            else if (enemy.row == 'middle') {
                this.middleRowEnemies.push(enemy);
            }
            else if (enemy.row == 'bottom') {
                this.bottomRowEnemies.push(enemy);
            }
        });
    }

    moveTo() {
        if (this.battleState == 'movingToFormation') {
            //generate target coordinates
            //movingToTarget coordinates get set in relevant attackList functions
            this.targetX = this.formationX;
            this.targetY = this.formationY;
        }

        //normalize vector
        if (this.x < this.targetX) {
            this.vecX = this.targetX - this.x;
        }
        else if (this.x > this.targetX) {
            this.vecX = this.x - this.targetX;
        }
        if (this.y <= this.targetY) {
            this.vecY = this.targetY - this.y;
        }
        else if (this.y > this.targetY) {
            this.vecY = this.y - this.targetY;
        }
        this.distance = Math.hypot(this.vecX, this.vecY);
        this.vecX /= this.distance;
        this.vecY /= this.distance;

        //prevent continuous x and y increment by checking if it has arrived at its destination
        if (this.battleState == 'movingToTarget') {
            if (this.x < this.targetX) {
                this.x += this.vecX * this.vectorSpeed;
                this.y += this.vecY * this.vectorSpeed;
            }
            else if (this.x >= this.targetX) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.battleState = 'attacking';
            }
        }
        else if (this.battleState == 'movingToFormation') {
            if (this.x > this.targetX) {
                this.x -= this.vecX * this.vectorSpeed;
                this.y -= this.vecY * this.vectorSpeed;
            }
            else if (this.x <= this.targetX) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.battleState = 'movingToTarget';
                this.basicDone = 'yes';
            }
        }
    }
}