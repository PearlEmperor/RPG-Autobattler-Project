class Hero {
    constructor() {
        this.type = 'hero';
        this.isSprite = true;
        this.fury = 0;
        this.furyMax = 100;
        this.hasInitial = true;
        this.hasCombo = true;
        this.hasFinisher = true;
        this.comboCooldown = 0;
        this.finisherCooldown = 0;
        this.column = 'front';
        this.row = 'middle';
    }

    addCooldown(skill) {
        if (skill === 'combo') {
            this.comboCooldown += 2;
        }
        if (skill === 'finisher') {
            this.comboCooldown += 2;
            this.finisherCooldown += 4;
        }
    }
}

export class Warrior extends Hero {
    constructor() {
        super();
        this.combatType = 'warrior';
        this.width = 128;
        this.height = 128;
        this.health = 50;
        this.maxHealth = 50;
        this.physicalAttack = 0;
        this.magicAttack = 0;
        this.physicalDefense = 50;
        this.magicDefense = 50;
        this.agility = 50;
    }
}
