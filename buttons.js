class Button {
    constructor(game) {
        this.game = game;
    }

    update() {

    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export class DungeonPortal extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = 200;
        this.height = 200;
        this.image = document.getElementById('dungeonPortal');
        this.image.onclick = function() {
            // this.update();
            console.log('hello');
        }
    }

    update() {
        console.log('hello');
    }
}