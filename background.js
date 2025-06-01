class StaticBackground {
    constructor() {
        this.type = 'static';
        this.movingDone = false;
    }
}

export class MainMenu extends StaticBackground {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = false;
        this.width = this.game.width;
        this.height = this.game.height;
        this.x = 0;
        this.y = 0;
        this.image = document.getElementById('mainMenu');
    }
}

export class CharacterMenu extends StaticBackground {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = false;
        this.width = 1440;
        this.height = 800;
        this.x = (this.game.width - this.width) / 2;
        this.y = (this.game.height - this.height) / 2;
        this.image = document.getElementById('characterMenu');
    }
}

class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.speedModifier = speedModifier;
        this.image = image;
    }

    update() {
        if (this.x < -this.width) {
            this.x = 0;
        }
        else this.x -= this.game.spawnSpeed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width - 5, this.y, this.width, this.height);
    }
}

class ScrollingBackground {
    constructor() {
        this.type = 'scrolling';
        this.movingDone = false;
    }
    
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update();
        });
    }

    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        });
    }
}

export class Forest1 extends ScrollingBackground {
    constructor(game) {
        super();
        this.game = game;
        this.width = 2000;
        this.layer1 = new Layer(this.game, this.width, this.game.height, 1/8, document.getElementById('forestLayer1'));
        this.layer2 = new Layer(this.game, this.width, this.game.height, 1/4, document.getElementById('forestLayer2'));
        this.layer3 = new Layer(this.game, this.width, this.game.height, 1/2, document.getElementById('forestLayer3'));
        this.layer4 = new Layer(this.game, this.width, this.game.height, 1, document.getElementById('forestLayer4'));
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4];
    }
}
