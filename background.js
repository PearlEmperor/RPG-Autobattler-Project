class StaticBackground {
    constructor() {
        
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export class MainMenu extends StaticBackground {
    constructor(game) {
        super();
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.image = document.getElementById('mainMenu');
        this.x = 0;
        this.y = 0;
    }
}

class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.speed = 1;
    }

    update() {
        if (this.x < -this.width) {
            this.x = 0;
        }
        else this.x -= this.speed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width - 5, this.y, this.width, this.height);
    }
}

class ScrollingBackground {
    constructor() {
        
    }
    
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }

    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
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