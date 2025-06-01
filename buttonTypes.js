import * as System from "./systems.js";

class Button {
    constructor(game) {
        this.game = game;
        this.isHovered = false;
    }

    draw(context) {
        if (this.isHovered === false) {
            this.spriteX = 0;
        }
        else if (this.isHovered === true) {
            this.spriteX = this.spriteWidth;
        }
        System.draw(context, this);
    }
}

export class ButtonRect extends Button {
    constructor() {
        super();
        this.shape = 'rect';
    }

    clickUpdate(mousePos) {
        if (System.isInsideRect(mousePos, this) === true) {
            this.update();
        }
    }
}

export class ButtonEllipse extends Button {
    constructor() {
        super();
        this.shape = 'ellipse';
    }
    

    clickUpdate(mousePos) {
        if (System.isInsideEllipse(mousePos, this) === true) {
            this.update();
        }
    }
}