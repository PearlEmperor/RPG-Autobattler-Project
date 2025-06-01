import * as System from "./systems.js";
import * as GameState from "./gameStates.js";
import * as Warrior from "./warrior.js";
import { InputHandler } from "./inputHandler.js";

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    class Game {
        constructor(canvas) {
            this.width = canvas.width;
            this.height = canvas.height;
            this.input = new InputHandler(canvas, this);

            this.spawnSpeed = 3; //adjusts how fast the backgrounds/enemies move when spawning a new wave
            this.playerLevel = 1;
            this.activeOverlay = 'none';

            //needed in multiple gameStates - easier than trying to pass them between each state that needs them
            this.currentWave = 1;
            this.maxEnemies = 1;

            //stores the player's party layout and unused heroes - party will later be created/adjusted using player input
            this.party = [new Warrior.Paladin(this)];
            this.extraHeroes = [];

            //list of possible spawn points during battle - !! need to figure this out before moving to party management !!
            // this.heroFormation = [{formationX: 50, formationY: 50, column: 'back', row: 'top'}, {formationX: 50, formationY: 100, column: 'back', row: 'middle'}, {formationX: 50, formationY: 150, column: 'back', row: 'bottom'}, {formationX: 150, formationY: 50, column: 'front', row: 'top'}, {formationX: 150, formationY: 100, column: 'front', row: 'middle'}, {formationX: 150, formationY: 150, column: 'front', row: 'bottom'}];
            // this.enemyFormation = [{formationX: 350, formationY: 50, column: 'front', row: 'top'}, {formationX: 350, formationY: 100, column: 'front', row: 'middle'}, {formationX: 350, formationY: 150, column: 'front', row: 'bottom'}, {formationX: 400, formationY: 50, column: 'back', row: 'top'}, {formationX: 400, formationY: 100, column: 'back', row: 'middle'}, {formationX: 400, formationY: 150, column: 'back', row: 'bottom'}];

            //Sets initial GameState
            this.gameStates = [new GameState.SpawningWave(this),
                               new GameState.Battling(this),
                               new GameState.MainMenu(this),
                               new GameState.NewDungeon(this)];
            this.currentGameState = this.gameStates[2];
            this.currentGameState.enter();
        }

        update() {
            this.currentGameState.handler();
        }

        draw(context) {
            this.currentGameState.draw(context);
        }

        setGameState(state) {
            this.currentGameState = this.gameStates[state];
            this.currentGameState.enter();
        }
    }

    const game = new Game(canvas);
    console.log(game);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
