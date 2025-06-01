import * as Background from "./background.js";
import * as Button from "./buttons.js";
import * as BasicEnemy from "./basicEnemy.js";
import * as System from "./systems.js";

const gameStates = {
    SPAWNING_WAVE: 0,
    BATTLING: 1,
    MAIN_MENU: 2,
    NEW_DUNGEON: 3,
}

class GameState {
    constructor(state) {
        this.state = state;
    }

    addEnemy() {
        //generates new enemies for use in battle
        //will need to read current dungeon state and generate enemies accordingly
            //use this to set enemy formation data?
            //read formation data and include in paramaters with this.game
            //use formation data to make sure a relevant enemy is spawned in each spot
                //no warriors in the back, no mages in front, archers flex?
        // this.game.enemies.push(new BasicEnemy.GoblinFighter(this.game));
        this.enemyGroup = [];
        switch (this.game.selectedDungeon) {
            case 'forest1':
                this.enemyGroup = [new BasicEnemy.GoblinFighter(this.game)];
                break;
            case 'desert':
                break;
            case 'mountain':
                break;
            case 'cave':
                break;
            case 'quarry':
                break;
            case 'canyon':
                break;
            case 'snowMountain':
                break;
            case 'castle':
                break;
            case 'abyssRuin':
                break;
            case 'lostObservatory':
                break;
            case 'meteorField':
                break;
            default:
                this.enemyGroup = [new BasicEnemy.GoblinFighter(this.game)];
        }
        this.game.enemies.push(this.enemyGroup[Math.floor(Math.random() * this.enemyGroup.length)]);
    }

    gameStateDraw(context, drawArray) {
        if (drawArray.includes('background')) {
            this.game.backgrounds.forEach(background => {
                if (background.type === 'static') {
                    System.draw(context, background);
                }
                else if (background.type === 'scrolling') {
                    background.draw(context);
                }
            });
        }
        if (drawArray.includes('combatant')) {
            System.drawArray(context, this.game.combatants);
        }
        if (drawArray.includes('button')) {
            this.game.buttons.forEach(button => {
                button.draw(context);
            });
        }
        if (drawArray.includes('menuOverlay')) {
            System.drawArray(context, this.game.menuOverlays);
            this.game.menuOverlayButtons.forEach(button => {
                button.draw(context);
            });
        }
        if (drawArray.includes('optionOverlay')) {
            System.drawArray(context, this.game.optionOverlays);
            this.game.optionOverlayButtons.forEach(button => {
                button.draw(context);
            });
        }
        if (drawArray.includes('infoOverlay')) {
            System.drawArray(context, this.game.infoOverlays);
        }
        //fix this once dragging is done
        if (drawArray.includes('draggables')) {
            this.game.draggables.forEach(object => {
                object.draw(context);
            });
        }
    }
}

export class SpawningWave extends GameState {
    constructor(game) {
        super('SPAWNING WAVE');
        this.game = game;
    }

    enter() {
        if (this.game.backgrounds.length < 1) {
            this.game.backgrounds = [new Background.Forest1(this.game)];
            //this is getting moved when the menu is ready for selecting dungeons
            //main menu => selected dungeon switch => area to load (forest, desert, etc) (will include enemy lists) => here
        }

        //reset relevant arrays and checks
        this.game.enemies = [];
        this.game.combatants = [];
        this.battleReady = 0;
    
        //are any heroes left alive
        if (this.game.heroes === undefined || this.game.heroes.length === 0) {
            this.game.heroes = [];
            //add each party member to the hero list
            this.game.party.forEach(hero => {
                this.game.heroes.push(hero);
            });
        }

        while (this.game.enemies.length < this.game.maxEnemies) {
            //change when enemy formation data starts being set
            this.addEnemy();
        }

        //add each enemy and hero to the combatant list
        this.game.heroes.forEach(hero => {
            this.game.combatants.push(hero);
        });
        this.game.enemies.forEach(enemy => {
            this.game.combatants.push(enemy);
        });
    }

    handler() {
        //check if number of battleReady enemies is equal to number of enemies
        if (this.battleReady < this.game.enemies.length) {
            this.game.backgrounds.forEach(background => {
                background.update();
            });
            this.game.enemies.forEach(enemy => {
                //move enemy and background left if not in formation
                if (enemy.x > enemy.formationX) {
                    enemy.x -= this.game.spawnSpeed;
                }
                else if (enemy.x <= enemy.formationX) {
                    enemy.battleState = 'movingToTarget';
                    this.battleReady++;
                }
            });
        }
        else if (this.battleReady === this.game.enemies.length) {
            // this.battleReady = 0;
            // this.game.setGameState(gameStates.BATTLING);
        }
    }

    draw(context) {
        this.gameStateDraw(context, ['background', 'combatant', 'button', 'menuOverlay']);
    }
}

export class Battling extends GameState {
    constructor(game) {
        super('BATTLING');
        this.game = game;
    }

    enter() {
        //extra checks for combat
        this.targetList = [];
        this.currentCombatant = 0;
        this.battleState = 'movingToTarget';
        this.movingDone = false;
        this.basicDone = false;
        this.initialDone = false;
        this.comboDone = false;
        this.finisherDone = false;

        //sort combatants by descending agility
        this.game.combatants.sort(function(a, b) {
            return b.agility - a.agility
        });
    }

    handler() {
        //check if is there another combatant in the list that needs to go
        if (this.currentCombatant < this.game.combatants.length) {
            this.game.combatants.forEach(combatant => {

                //is this the current combatant
                if (this.game.combatants.indexOf(combatant) === this.currentCombatant) {

                    //check if combatant is alive
                    if (combatant.health > 0) {

                        //read combatant fury, cooldowns, and available skills and initiate appropriate action(s)
                        if (combatant.fury === 100 && combatant.comboCooldown === 0 && combatant.finisherCooldown === 0 && combatant.hasFinisher === true) {
                            System.attackLoop(combatant, this, 'initial');
                            System.attackLoop(combatant, this, 'combo');
                            System.attackLoop(combatant, this, 'finisher');
                            if (this.finisherDone === true) {
                                System.turnCleanup(combatant, this, 'finisher');
                            }
                        }
                        else if (combatant.fury < 100 && combatant.fury >= 60 && combatant.comboCooldown === 0 && combatant.hasCombo === true) {
                            System.initialLoop(combatant, this);
                            System.comboLoop(combatant, this);
                            if (this.comboDone === true) {
                                System.turnCleanup(combatant, this, 'combo');
                            }
                        }
                        else if (combatant.fury < 60 && combatant.fury >= 30 && combatant.hasInitial === true) {
                            System.initialLoop(combatant, this);
                            if (this.initialDone === true) {
                                System.turnCleanup(combatant, this, 'initial');
                            }
                        }
                        else if (combatant.fury < 30) {
                            if (this.basicDone === false) {
                                if (this.targetList.length === 0) {
                                    if (combatant.type === 'hero') {
                                        System.sortTargetList(this.game.enemies, this);
                                    }
                                    else if (combatant.type === 'enemy') {
                                        System.sortTargetList(this.game.heroes, this);
                                    }
                                    System.basicList(combatant, this);
                                }
                                else if (this.targetList.length > 0) {
                                    System.turnLoop(combatant, this, 'basic');
                                }
                            }
                            else if (this.basicDone === true) {
                                this.basicDone = false;
                                this.targetList = [];
                                combatant.fury += combatant.furyGain;
                                if (combatant.fury > combatant.furyMax) {
                                    combatant.fury = combatant.furyMax;
                                }
                                this.currentCombatant++;
                            }
                        }
                        
                    }
                    else if (combatant.health <= 0) {
                        this.currentCombatant++;
                    }
                }
            });
        }
        //check if all combatants have gone
        else if (this.currentCombatant >= this.game.combatants.length) {
            this.currentCombatant = 0;
            this.game.combatants.forEach(combatant => {
                //check for defeated combatants and remove from relevant arrays
                if (combatant.health <= 0) {
                    if (combatant.type === 'hero') {
                        this.game.heroes.forEach(hero => {
                            this.game.heroes.splice(this.game.heroes.indexOf(hero));
                        });
                    }
                    else if (combatant.type === 'enemy') {
                        this.game.enemies.forEach(enemy => {
                            this.game.enemies.splice(this.game.enemies.indexOf(enemy));
                        });
                    }
                    this.game.combatants.splice(this.game.combatants.indexOf(combatant));
                }
            });
            //are there both heroes and enemies still alive
            if (this.game.heroes.length > 0 && this.game.enemies.length > 0) {
                this.game.setGameState(gameStates.BATTLING);
            }
            //are there only heroes still alive
            else if (this.game.heroes.length > 0 && this.game.enemies.length === 0) {
                this.game.currentWave++;
                // if (this.game.currentWave < 6) {
                //     this.game.maxEnemies++;
                // }
                this.game.setGameState(gameStates.SPAWNING_WAVE);
            }
            //if no heroes are still alive
            else if (this.game.heroes.length === 0) {
                //
                //check if auto retry is on once it has been created
                //
                //set each party members' health back to max
                this.game.party.forEach(party => {
                    party.health = party.maxHealth;
                });
                this.game.currentWave = 1;
                this.game.setGameState(gameStates.NEW_DUNGEON);
            }
        }
    }

    draw(context) {
        this.gameStateDraw(context, ['background', 'combatant', 'button', 'menuOverlay']);
    }
}

export class MainMenu extends GameState {
    constructor(game) {
        super('MAIN MENU');
        this.game = game;
    }

    enter() {
        this.game.heroes = [];
        this.game.enemies = [];
        this.game.combatants = [];
        this.game.backgrounds = [new Background.MainMenu(this.game)];
        this.game.buttons = [];
        this.game.menuOverlays = [];
        this.game.menuOverlayButtons = [];
        this.game.optionOverlays = [];
        this.game.optionOverlayButtons = [];
        this.game.draggables = [];

        //read player level and make available the relevant mechanics
        if (this.game.playerLevel > 0) {
            this.game.buttons.push(new Button.DungeonPortal(this.game),
                                   new Button.CharacterMenuButton(this.game));
                                   this.game.draggables.push(new Button.CharacterMenuButtonTest(this.game));
            // if (this.game.playerLevel > 5) {
            //     this.game.buttons.push(new Button.Crafting(this.game));
            // }
        }
    }

    handler() {

    }

    draw(context) {
        this.gameStateDraw(context, ['background']);

        let totalWidth = this.game.buttons.reduce((sum, button) => {
            if (button.category === 'core') {
                sum += button.width;
            }
            return sum;
        }, 0);
        let currentX = (this.game.width - totalWidth) / 2;
        this.game.buttons.forEach(button => {
            if (button.category === 'core') {
                button.x = currentX;
                currentX += button.width + 20;
            }
            button.draw(context);
        });

        this.gameStateDraw(context, ['menuOverlay', 'draggables']);
    }
}

export class NewDungeon extends GameState {
    constructor(game) {
        super('NEW DUNGEON');
        this.game = game;
    }

    enter() {
        this.game.heroes = [];
        this.game.enemies = [];
        this.game.combatants = [];
        this.game.menuOverlays = [];
        
        switch (this.game.selectedDungeon) {
            case 'forest1':
                this.game.backgrounds = [new Background.Forest1(this.game)];
                break;
            case 'desert':
                this.game.backgrounds = [new Background.Desert(this.game)];
                break;
            case 'mountain':
                this.game.backgrounds = [new Background.Mountain(this.game)];
                break;
            case 'cave':
                this.game.backgrounds = [new Background.Cave(this.game)];
                break;
            case 'quarry':
                this.game.backgrounds = [new Background.Quarry(this.game)];
                break;
            case 'canyon':
                this.game.backgrounds = [new Background.Canyon(this.game)];
                break;
            case 'snowMountain':
                this.game.backgrounds = [new Background.SnowMountain(this.game)];
                break;
            case 'castle':
                this.game.backgrounds = [new Background.Castle(this.game)];
                break;
            case 'abyssRuin':
                this.game.backgrounds = [new Background.AbyssRuin(this.game)];
                break;
            case 'lostObservatory':
                this.game.backgrounds = [new Background.LostObservatory(this.game)];
                break;
            case 'meteorField':
                this.game.backgrounds = [new Background.MeteorField(this.game)];
                break;
            default:
                this.game.backgrounds = [new Background.Forest1(this.game)];
        }
        this.game.buttons = [new Button.DungeonReturn(this.game)];
        this.game.setGameState(gameStates.SPAWNING_WAVE);
    }
}
