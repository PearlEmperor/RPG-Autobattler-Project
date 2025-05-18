import * as Warrior from "./warrior.js";
import * as BasicEnemy from "./basicEnemy.js";
import * as GameState from "./gameStates.js";

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.playerLevel = 1;
            this.backgrounds = [];

            //stores the player's party layout and unused heroes - party will later be created/adjusted using player input
            this.party = [new Warrior.Warrior(this)];
            this.extraHeroes = [];

            //used in the combat loop, here so they can be easily accessed by combatants during battling gameState
            this.heroes = [];
            this.enemies = [];
            this.combatants = [];

            //extra checks needed for various parts of the combat loop
            this.battleReady = 0;
            this.currentWave = 0;
            this.maxEnemies = 1;
            this.currentCombatant = 0;

            //list of possible spawn points during battle - !! need to figure this out before moving to party management !!
            // this.heroFormation = [{formationX: 50, formationY: 50, column: 'back', row: 'top'}, {formationX: 50, formationY: 100, column: 'back', row: 'middle'}, {formationX: 50, formationY: 150, column: 'back', row: 'bottom'}, {formationX: 150, formationY: 50, column: 'front', row: 'top'}, {formationX: 150, formationY: 100, column: 'front', row: 'middle'}, {formationX: 150, formationY: 150, column: 'front', row: 'bottom'}];
            // this.enemyFormation = [{formationX: 350, formationY: 50, column: 'front', row: 'top'}, {formationX: 350, formationY: 100, column: 'front', row: 'middle'}, {formationX: 350, formationY: 150, column: 'front', row: 'bottom'}, {formationX: 400, formationY: 50, column: 'back', row: 'top'}, {formationX: 400, formationY: 100, column: 'back', row: 'middle'}, {formationX: 400, formationY: 150, column: 'back', row: 'bottom'}];

            //Sets initial GameState
            this.gameStates = [new GameState.SpawningWave(this), new GameState.Battling(this), new GameState.MainMenu(this)];
            this.currentGameState = this.gameStates[0];
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

        addEnemy() {
            //generates new enemies for use in battle
            //will need to read current dungeon state and generate enemies accordingly
            //move relevant data here from spawningWave gameState
            this.enemies.push(new BasicEnemy.GoblinFighter(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
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
