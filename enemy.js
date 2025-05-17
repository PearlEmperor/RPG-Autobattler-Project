export class Enemy {
    constructor(game) {
        this.game = game;
        this.type = 'enemy';
        this.fury = 0;
        this.furyMax = 100;
        this.vectorSpeed = 10;
        this.targetList = [];
        this.battleState = 'spawning';
        this.column = 'front';
        this.row = 'middle';

        //used to check if the attack loop is over so the next combatant/attack loop can be triggered
        this.basicDone = 'no';
        this.initialDone = 'no';
    }

    draw(context) {
        context.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    sortTargetList() {
        //separates heroes into relevant rows/columns for use in targeting
        this.frontColumnHeroes = [];
        this.backColumnHeroes = [];
        this.topRowHeroes = [];
        this.middleRowHeroes = [];
        this.bottomRowHeroes = [];
        this.game.heroes.forEach(hero => {
            if (hero.column == 'front') {
                this.frontColumnHeroes.push(hero);
            }
            else if (hero.column == 'back') {
                this.backColumnHeroes.push(hero);
            }
            if (hero.row == 'top') {
                this.topRowHeroes.push(hero);
            }
            else if (hero.row == 'middle') {
                this.middleRowHeroes.push(hero);
            }
            else if (hero.row == 'bottom') {
                this.bottomRowHeroes.push(hero);
            }
        });
    }

    moveTo() {
        if (this.battleState == 'spawning' || this.battleState == 'movingToFormation') {
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
        if (this.battleState == 'spawning' || this.battleState == 'movingToTarget') {
            if (this.x > this.targetX) {
                this.x -= this.vecX * this.vectorSpeed;
                this.y -= this.vecY * this.vectorSpeed;
            }
            else if (this.x <= this.targetX) {
                this.x = this.targetX;
                this.y = this.targetY;
                if (this.battleState == 'spawning') {
                    this.battleState = 'movingToTarget';
                    this.game.battleReady++;
                }
                else if (this.battleState == 'movingToTarget') {
                    this.battleState = 'attacking';
                }
            }
        }
        else if (this.battleState == 'movingToFormation') {
            if (this.x < this.targetX) {
                this.x += this.vecX * this.vectorSpeed;
                this.y += this.vecY * this.vectorSpeed;
            }
            else if (this.x >= this.targetX) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.battleState = 'movingToTarget';
                this.basicDone = 'yes';
            }
        }
    }
}