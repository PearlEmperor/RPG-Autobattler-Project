import * as Background from "./background.js";
import * as Button from "./buttons.js";

const gameStates = {
    SPAWNING_WAVE: 0,
    BATTLING: 1,
    MAIN_MENU: 2,
}

class GameState {
    constructor(state) {
        this.state = state;
        // this.fps = 20;
        // this.frameInterval = 1000/this.fps;
        // this.frameTimer = 0;
    }

    draw() {
        // this.game.background.draw(context);
    }
}

export class SpawningWave extends GameState {
    constructor(game) {
        super('SPAWNING WAVE');
        this.game = game;
    }

    enter() {
        this.game.enemies = [];
        this.game.combatants = [];

        if (this.game.backgrounds.length < 1) {
            this.game.backgrounds = [new Background.Forest1(this.game)]; //main menu state => switch => area to load (forest, desert, etc) => here
        }
        //are any heroes left alive
        if (this.game.heroes.length == 0) {
            //add each party member to the hero list
            this.game.party.forEach(hero => {
                this.game.heroes.push(hero);
            });
        }
        this.game.heroes.forEach(hero => {
            hero.combatantID = this.combatantID;
            this.combatantID++;
            this.game.combatants.push(hero);
        });
        //change when formation data starts being set
        while (this.game.enemies.length < this.game.maxEnemies) {
            this.game.addEnemy();
        }
        //add each enemy to the combatant list
        this.game.enemies.forEach(enemy => {
            enemy.combatantID = this.combatantID;
            this.combatantID++;
            //use this to set enemy formation data?
            //will need to read current wave and dungeon
            // enemy.append(this.game.enemyFormation[currentEnemyFormation]);
            this.game.combatants.push(enemy);
        });
    }

    handler() {
        //check if number of battleReady enemies is equal to number of enemies
        if (this.game.battleReady < this.game.enemies.length) {
            this.game.enemies.forEach(enemy => {
                //move enemy and background left if not in formation
                if (enemy.battleState == 'spawning') {
                    enemy.moveTo();
                    this.game.backgrounds.forEach(background => {
                        background.update();
                    });
                }
            });
        }
        else if (this.game.battleReady == this.game.enemies.length) {
            this.game.battleReady = 0;
            this.combatantID = 1;
            this.game.setGameState(gameStates.BATTLING);
        }
    }

    draw(context) {
        this.game.backgrounds.forEach(background => {
            background.draw(context);
        });
        this.game.combatants.forEach(combatant => {
            combatant.draw(context);
        });
    }
}

export class Battling extends GameState {
    constructor(game) {
        super('BATTLING');
        this.game = game;
    }

    enter() {
        this.game.currentCombatant = 0;

        //sort combatants by descending agility
        this.game.combatants.sort(function(a, b) {
            return b.agility - a.agility
        });
    }

    handler() {
        //check if is there another combatant in the list that needs to go
        if (this.game.currentCombatant < this.game.combatants.length) {
            this.game.combatants.forEach(combatant => {

                //is this the current combatant
                if (this.game.combatants.indexOf(combatant) == this.game.currentCombatant) {

                    //check if combatant is alive
                    if (combatant.health > 0) {

                        //is the combatant a melee attacker
                        if (combatant.combatType == 'warrior') {

                            //read combatant fury and cooldowns and initiate appropriate action(s)
                            if (combatant.fury == 100 && combatant.comboCooldown == 0 && combatant.finisherCooldown == 0) {
                                // combatant.attackInitial();
                                // combatant.attackCombo();
                                // combatant.attackFinisher();
                            }
                            else if (100 > combatant.fury >= 60 && combatant.comboCooldown == 0) {
                                // combatant.attackInitial();
                                // combatant.attackCombo();
                            }
                            else if (60 > combatant.fury >= 30) {
                                // combatant.attackInitial();
                            }
                            else if (combatant.fury < 30) {
                                if (combatant.basicDone == 'no') {
                                    if (combatant.targetList.length == 0) {
                                        combatant.sortTargetList();
                                        combatant.basicList();
                                    }
                                    else if (combatant.targetList.length > 0) {
                                        if (combatant.battleState == 'movingToTarget') {
                                            combatant.moveTo();
                                        }
                                        else if (combatant.battleState == 'attacking') {
                                            combatant.attackBasic();
                                        }
                                        else if (combatant.battleState == 'movingToFormation') {
                                            combatant.moveTo();
                                        }
                                    }
                                }
                                else if (combatant.basicDone == 'yes') {
                                    combatant.basicDone = 'no';
                                    combatant.targetList = [];
                                    this.game.currentCombatant++;
                                }
                            }
                        }
                        else if (combatant.combatType != 'warrior') {

                            //read combatant fury and cooldowns and initiate appropriate action(s)
                            if (combatant.fury == 100 && combatant.comboCooldown == 0 && combatant.finisherCooldown == 0) {
                                // combatant.attackInitial();
                                // combatant.attackCombo();
                                // combatant.attackFinisher();
                            }
                            else if (100 > combatant.fury >= 60 && combatant.comboCooldown == 0) {
                                // combatant.attackInitial();
                                // combatant.attackCombo();
                            }
                            else if (60 > combatant.fury >= 30) {
                                // combatant.attackInitial();
                            }
                            else if (combatant.fury < 30) {
                                if (combatant.basicDone == 'no') {
                                    if (combatant.targetList.length == 0) {
                                        combatant.basicList();
                                    }
                                    if (combatant.battleState == 'movingToTarget') {
                                        combatant.battleState = 'attacking';
                                    }
                                    else if (combatant.battleState == 'attacking') {
                                        combatant.attackBasic();
                                    }
                                    else if (combatant.battleState == 'movingToFormation') {
                                        combatant.battleState = 'movingToTarget';
                                    }
                                }
                                else if (combatant.basicDone == 'yes') {
                                    combatant.basicDone = 'no';
                                    combatant.targetList = [];
                                    this.game.currentCombatant++;
                                }
                            }
                        }
                    }
                    else if (combatant.health <= 0) {
                        this.game.currentCombatant++;
                    }
                }
            });
        }
        //check if all combatants have gone
        else if (this.game.currentCombatant >= this.game.combatants.length) {
            this.game.currentCombatant = 0;
            this.game.combatants.forEach(combatant => {

                //reset relevant combat checks
                combatant.basicDone = 'no';
                combatant.targetList = [];

                //check for defeated combatants and remove from relevant arrays
                if (combatant.health <= 0) {
                    this.deletionID = combatant.combatantID;
                    if (combatant.type == 'hero') {
                        this.game.heroes.forEach(hero => {
                            if (this.deletionID == hero.combatantID) {
                                this.game.heroes.splice(this.game.heroes.indexOf(hero));
                            }
                        });
                    }
                    else if (combatant.type == 'enemy') {
                        this.game.enemies.forEach(enemy => {
                            if (this.deletionID == enemy.combatantID) {
                                this.game.enemies.splice(this.game.enemies.indexOf(enemy));
                            }
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
            else if (this.game.heroes.length > 0 && this.game.enemies.length == 0) {
                this.game.currentWave++;
                // if (this.game.currentWave < 6) {
                //     this.game.maxEnemies++;
                // }
                this.game.setGameState(gameStates.SPAWNING_WAVE);
            }
            //if no heroes are still alive
            else if (this.game.heroes.length == 0) {
                //
                //check if auto retry is on once it has been created
                //
                //set each party members' health back to max
                this.game.party.forEach(party => {
                    party.health = party.maxHealth;
                });
                this.game.currentWave = 1;
                this.game.backgrounds = [new Background.Forest1(this.game)]
                this.game.setGameState(gameStates.SPAWNING_WAVE);
            }
        }
    }

    draw(context) {
        this.game.backgrounds.forEach(background => {
            background.draw(context);
        });
        this.game.combatants.forEach(combatant => {
            combatant.draw(context);
        });
    }
}

export class MainMenu extends GameState {
    constructor(game) {
        super('MAIN MENU');
        this.game = game;
    }

    enter() {
        this.game.activeButtons = [];
        this.game.backgrounds.push(new Background.MainMenu(this.game));

        //read player level and make available the relevant mechanics
        switch (this.game.playerLevel > 0) {
            case this.game.playerLevel >= 1:
                this.game.activeButtons.push(new Button.DungeonPortal(this.game));
        }

        //generate lock? icon(s) where needed to signify content to be unlocked later
    }

    handler() {

    }

    draw(context) {
        this.game.backgrounds.forEach(background => {
            background.draw(context);
        });
        this.game.activeButtons.forEach(button => {
            button.draw(context);
        });
    }
}