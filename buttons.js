import * as Button from "./buttonTypes.js";
import * as Background from "./background.js";
import * as System from "./systems.js";

export class DungeonPortal extends Button.ButtonEllipse {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.width = 300;
        this.height = 440;
        this.x = 1230;
        this.y = 230;
        this.spriteX = 0;
        this.spriteY = 0;
        this.spriteWidth = 300;
        this.spriteHeight = 300;
        this.image = document.getElementById('dungeonPortal');
    }

    update() {
        this.game.buttons = [new DungeonReturn(this.game)/* , new SettingsButton(this.game) */];
        this.game.backgrounds = [];
        this.game.setGameState(3);
    }
}

export class CloseButton extends Button.ButtonEllipse {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.isSprite = true;
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.spriteX = 0;
        this.spriteY = 0;
        this.spriteWidth = 30;
        this.spriteHeight = 30;
        this.image = document.getElementById('closeButton');
    }

    update() {
        this.game.menuOverlays = [];
        this.game.menuOverlayButtons = [];
        this.game.activeOverlay = 'none';
    }
}

export class EnchantButton extends Button.ButtonEllipse {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.width = 80;
        this.height = 80;
        this.x = 470;
        this.y = 705;
        this.spriteX = 0;
        this.spriteY = 0;
        this.spriteWidth = 80;
        this.spriteHeight = 80;
        this.image = document.getElementById('enchantButton');
    }

    update() {
        System.generateMenu(this.game, 'enchantMenu');
        this.game.previousOverlay = 'characterMenu';
    }
}

export class MenuReturnButton extends Button.ButtonEllipse {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.width = 80;
        this.height = 80;
        this.x = 100;
        this.y= 100;
        this.spriteX = 0;
        this.spriteY = 0;
        this.spriteWidth = 80;
        this.spriteHeight = 80;
        this.image = document.getElementById('menuReturnButton');
    }

    update() {
        if (this.game.previousOverlay === 'characterMenu') {
            System.generateMenu(this.game, 'characterMenu');
        }
        this.game.previousOverlay = 'none';
    }
}

export class CharacterMenuButton extends Button.ButtonRect {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.category = 'core';
        this.width = 125;
        this.height = 125;
        this.x = 0;
        this.y = this.game.height - this.height - 1;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 160;
        this.spriteY = 480;
        this.image = document.getElementById('characterMenuButton');
    }

    update() {
        System.generateMenu(this.game, 'characterMenu');
    }
}

export class DungeonReturn extends Button.ButtonRect {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.category = 'battle';
        this.width = 150;
        this.height = 50;
        this.x = 885;
        this.y = 1020;
        this.spriteWidth = 150;
        this.spriteHeight = 50;
        this.spriteX = 0;
        this.spriteY = 0;
        this.image = document.getElementById('dungeonReturn');
    }

    update() {
        this.game.setGameState(2);
    }
}

export class CharacterMenuButtonTest extends Button.ButtonRect {
    constructor(game) {
        super();
        this.game = game;
        this.isSprite = true;
        this.category = 'core';
        this.width = 125;
        this.height = 125;
        this.x = 0;
        this.y = 0;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 160;
        this.spriteY = 480;
        this.normal = document.getElementById('characterMenuButton');
        this.hovered = document.getElementById('characterMenuButtonHovered');
        this.image = this.normal;
    }

    finishDrag() {
        //if mousePos in valid dropOff
            //this.startX, this.startY = undefined
        //else
            this.startX = this.x;
            this.startY = this.y;
            this.isDragging = false;
    }

    update() {
        System.generateMenu(this.game, 'characterMenu');
    }
}