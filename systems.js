import * as Background from "./background.js";
import * as Button from "./buttons.js";

export function moveTo(entity, gameState) {
    entity.vecX = entity.targetX - entity.x;
    entity.vecY = entity.targetY - entity.y;

    if (entity.vecX > 2 || entity.vecX < -2) {
        entity.x += entity.vecX/15;
        entity.y += entity.vecY/15;
    }
    else if (entity.vecX > 0 &&
            entity.vecX < 2 ||
            entity.vecX < 0 &&
            entity.vecX > -2
        ) {
        entity.x = entity.targetX;
        entity.y = entity.targetY;
        gameState.movingDone = true;
    }
}

export function sortTargetList(targets, gameState) {
    gameState.frontColumn = [];
    gameState.middleColumn = [];
    gameState.backColumn = [];
    gameState.topRow = [];
    gameState.middleRow = [];
    gameState.bottomRow = [];
    targets.forEach(target => {
        if (target.column == 'front') {
            gameState.frontColumn.push(target);
        }
        else if (target.column == 'middle') {
            gameState.middleColumn.push(target);
        }
        else if (target.column == 'back') {
            gameState.backColumn.push(target);
        }
        if (target.row == 'top') {
            gameState.topRow.push(target);
        }
        else if (target.row == 'middle') {
            gameState.middleRow.push(target);
        }
        else if (target.row == 'bottom') {
            gameState.bottomRow.push(target);
        }
    });
}

export function basicList(combatant, gameState) {
    if (combatant.combatType == 'warrior') {
        if (gameState.frontColumn.length > 0) {
            gameState.targetList.push(gameState.frontColumn[Math.floor(Math.random() * gameState.frontColumn.length)]);
        }
        else if (gameState.middleColumn.length > 0) {
            gameState.targetList.push(gameState.middleColumn[Math.floor(Math.random() * gameState.middleColumn.length)]);
        }
        else if (gameState.backColumn.length > 0) {
            gameState.targetList.push(gameState.backColumn[Math.floor(Math.random() * gameState.backColumn.length)]);
        }
        gameState.targetList.forEach(target => {
            if (combatant.type == 'hero') {
                combatant.targetX = target.x - combatant.width;
            }
            else if (combatant.type == 'enemy') {
                combatant.targetX = target.x + combatant.width;
            }
            combatant.targetY = target.y;
        });
    }
    else if (combatant.combatType != 'warrior') {
        if (combatant.type == 'hero') {
            gameState.targetList.push(this.game.enemies[Math.floor(Math.random() * this.game.enemies.length)]);
        }
        else if (combatant.type == 'enemy') {
            gameState.targetList.push(this.game.heroes[Math.floor(Math.random() * this.game.heroes.length)]);
        }
        //use targetX/Y for arrows instead of movement for archers
        combatant.targetX = target.x;
        combatant.targetY = target.y;
    }
}

export function initialList1x3(combatant, gameState, targets) {
    sortTargetList(targets, gameState);
    //in gamestate => combatant.initialList(gameState('this')) =>
    //in hero initialList() => System.initialList1x3(combatant('this'), gameState) => here

    //determine if targeting front or back
    if (gameState.frontColumn.length > 0) {
        gameState.targetList = gameState.frontColumn;
    }
    else if (gameState.frontColumn.length === 0) {
        gameState.targetList = gameState.backColumn;
    }
    //find average of coordinates and set respective moveTarget
    combatant.targetX, combatant.targetY = 0;
    gameState.targetList.forEach(target => {
        combatant.targetX += target.x;
        combatant.targetY += target.y;
    });
    combatant.targetX, combatant.targetY /= gameState.targetList.length;
}

export function attackBasic(combatant, gameState) {
    gameState.targetList.forEach(target => {
        if (combatant.combatType != 'mage') {
            target.health -= combatant.physicalAttack;
        }
        else if (combatant.combatType == 'mage') {
            target.health -= combatant.magicAttack;
        }
        if (target.health < 0) {
            target.health = 0;
        }
    });
}

export function draw(context, image) {
    if (image.isSprite === false) {
        context.drawImage(image.image, image.x, image.y, image.width, image.height);
    }
    else if (image.isSprite === true) {
        context.drawImage(image.image, image.spriteX, image.spriteY, image.spriteWidth, image.spriteHeight, image.x, image.y, image.width, image.height);
    }
}

//get the mouse position
export function getMousePos(canvas, event) {
    return {
        x: event.offsetX * canvas.width / canvas.clientWidth,
        y: event.offsetY * canvas.width / canvas.clientWidth
    }
}

export function isInsideEllipse(pos, ellipse) {
    let ellipseX = ellipse.x + ellipse.width/2;
    let ellipseY = ellipse.y + ellipse.height/2;
    let radiusX = ellipse.width/2;
    let radiusY = ellipse.height/2;
    let distX = Math.pow((pos.x - ellipseX), 2) / Math.pow(radiusX, 2);
    let distY = Math.pow((pos.y - ellipseY), 2) / Math.pow(radiusY, 2);

    if (distX + distY <= 1) {
        return true;
    }
    else return false;
}

export function isInsideRect(pos, rect) {
    if (pos.x >= rect.x &&
        pos.x < rect.x + rect.width &&
        pos.y >= rect.y &&
        pos.y < rect.y + rect.height
        ) {
        return true;
    }
    else return false;
}

export function isBehindOverlay(mousePos, button, overlays) {
    if (overlays.length > 0 && button.blocked === false) {
        let buttonState = false;
        let overlayState = false;
        overlays.forEach(overlay => {
            if (overlayState === false) {
                overlayState = isInsideRect(mousePos, overlay);
            }
        });
        if (button.shape === 'rect') {
            buttonState = isInsideRect(mousePos, button);
        }
        else if (button.shape === 'ellipse') {
            buttonState = isInsideEllipse(mousePos, button);
        }
        if (buttonState === true && overlayState === true) {
            button.blocked = true;
        }
        else if (buttonState === true && overlayState === false) {
            button.blocked =  false;
        }
        else if (buttonState === false) {
            button.blocked =  false;
        }
    }
}

export function moveToTarget(combatant, gameState) {
    if (combatant.combatType === 'mage') {
        gameState.battleState = 'attacking';
    }
    else if (gameState.movingDone === false) {
        //if archer moveTo(proj, gameState)
        //else if warrior
        moveTo(combatant, gameState);
    }
    else if (gameState.movingDone === true) {
        gameState.movingDone = false;
        gameState.battleState = 'attacking';
    }
}

export function moveToFormation(combatant, gameState) {
    if (gameState.movingDone === false) {
        combatant.targetX = combatant.formationX;
        combatant.targetY = combatant.formationY;
        moveTo(combatant, gameState);
    }
    else if (gameState.movingDone === true) {
        gameState.movingDone = false;
        gameState.battleState = 'movingToTarget';
    }
}

export function turnLoop(combatant, gameState, currentAttack) {
    if (gameState.battleState === 'movingToTarget') {
        moveToTarget(combatant, gameState);
    }
    else if (gameState.battleState === 'attacking') {
        if (currentAttack === 'basic') {
            attackBasic(combatant, gameState);
        }
        else if (currentAttack === 'initial') {
            combatant.attackInitial(gameState);
        }
        else if (currentAttack === 'combo') {
            combatant.attackCombo(gameState);
        }
        else if (currentAttack === 'finisher') {
            combatant.attackFinisher(gameState);
        }
        gameState.battleState = 'movingToFormation';
    }
    else if (gameState.battleState === 'movingToFormation') {
        moveToFormation(combatant, gameState);
    }
}

export function attackLoop(combatant, gameState, skill) {
    if (gameState.targetList.length === 0) {
        if (skill === 'initial' && gameState.initialDone === false) {
            combatant.initialList(gameState);
        }
        else if (skill === 'combo' && gameState.comboDone === false) {
            combatant.comboList(gameState);
        }
        else if (skill === 'finisher' && gameState.finisherDone === false) {
            combatant.finisherList(gameState);
        }
    }
    else if (gameState.targetList.length > 0) {
        turnLoop(combatant, gameState, skill);
        if (combatant.x === combatant.formationX && combatant.y === combatant.formationY && gameState.battleState === 'movingToTarget') {
            if (skill === 'initial') {
                gameState.initialDone = true;
            }
            else if (skill === 'combo') {
                gameState.comboDone = true;
            }
            else if (skill === 'finisher') {
                gameState.finisherDone = true;
            }
            gameState.targetList = [];
        }
    }
}

export function turnCleanup(combatant, gameState, skill) {
    if (gameState.initialDone === true) {
        gameState.initialDone = false;
        combatant.fury -= 30;
        if (gameState.comboDone === true) {
            combatant.addCooldown('combo');
            gameState.comboDone = false;
            combatant.fury -= 30;
            if (gameState.finisherDone === true) {
                combatant.addCooldown('finisher');
                gameState.finisherDone = false;
                combatant.fury -= 40;
            }
        }
    }
}

export function isInsideButton(pos, button) {
    if (((button.shape === 'rect' && isInsideRect(pos, button) === true) ||
        (button.shape === 'ellipse' && isInsideEllipse(pos, button) === true)) &&
        button.blocked === false
        ) {
        button.isHovered = true;
    }
    else button.isHovered = false;
}

export function drawArray(context, array) {
    if (array.length > 0) {
        array.forEach(image => {
            draw(context, image);
        });
    }
}

export function buttonHoverCheck(mousePos, buttonArray) {
    buttonArray.forEach(button => {
        if (button.isHovered === true) {
            button.clickUpdate(mousePos);
        }
    });
}

export function generateMenu(game, menu) {
    game.menuOverlays = [];
    game.menuOverlayButtons = [];

    if (game.activeOverlay != menu) {
        if (menu === 'characterMenu') {
            game.activeOverlay = 'characterMenu';
            game.menuOverlays.push(new Background.CharacterMenu(game));
            game.menuOverlayButtons.push(new Button.CloseButton(game, 1635, 150), new Button.EnchantButton(game));
        }
        if (menu === 'enchantMenu') {
            game.menuOverlays = [/* new Background.EnchantMenu(this.game) */];
            game.menuOverlayButtons = [/* new CloseButton(this.game, Xtbd, Ytbd) */ /* new MenuReturnButton(this.game, Xtbd, Ytbd) */];
            game.activeOverlay = 'characterEnchant';
        }
    }
    else if (game.activeOverlay === menu) {
        game.activeOverlay = 'none';
    }
}