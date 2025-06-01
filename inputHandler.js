import * as System from "./systems.js";

export class InputHandler {
    constructor(canvas, game) {
        let inputs = [];
        let isDragging = false;
        let mousePos, dragTarget, mouseRelX, mouseRelY, mouseStartX, mouseStartY;

        canvas.addEventListener('mousedown', function(event) {
            if ((event.button === 0 ||
                event.button === 2
                ) &&
                inputs.indexOf(event.button) === -1) {
                inputs.push(event.button);
            }
        });

        canvas.addEventListener('mouseup', function(event) {
            inputs.splice(inputs.indexOf(event.button), 1);

            if (event.button === 0) {
                if (isDragging === true) {
                    isDragging = false;
                    dragTarget.finishDrag();
                }
                else if (isDragging === false) {
                    mousePos = System.getMousePos(canvas, event);
                    System.buttonHoverCheck(mousePos, game.buttons);
                    System.buttonHoverCheck(mousePos, game.menuOverlayButtons);
                    System.buttonHoverCheck(mousePos, game.optionOverlayButtons);
                    System.buttonHoverCheck(mousePos, game.draggables);
                }
            }
        });

        canvas.addEventListener('mousemove', function(event) {
            mousePos = System.getMousePos(canvas, event);

            if (inputs.includes(0) === true) {
                game.draggables.forEach(object => {
                    if (isDragging === false && object.isHovered === true) {
                        dragTarget = object;
                        isDragging = true;
                        dragTarget.isDragging = true;
                    }
                    else if (isDragging === true) {
                        //save dragTarget starting coords
                        if (dragTarget.startX === undefined) {
                            dragTarget.startX = dragTarget.x;
                            dragTarget.startY = dragTarget.y;
                            mouseStartX = mousePos.x;
                            mouseStartY = mousePos.y;
                        }

                        //get inital object position relative to  inital mouse position
                        mouseRelX = dragTarget.startX + (mouseStartX - dragTarget.startX);
                        mouseRelY = dragTarget.startY + (mouseStartY - dragTarget.startY);

                        if (dragTarget.x != mousePos.x - mouseRelX || dragTarget.y != mousePos.y - mouseRelY) {
                            dragTarget.x = mousePos.x - mouseRelX;
                            dragTarget.y = mousePos.y - mouseRelY;
                        }
                    }
                });
            }
            
            else if (inputs.includes(0) === false) {
                if (game.buttons.length > 0) {
                    game.buttons.forEach(button => {
                        button.blocked = false;
                        System.isBehindOverlay(mousePos, button, game.menuOverlays);
                        System.isBehindOverlay(mousePos, button, game.optionOverlays);
                        System.isInsideButton(mousePos, button);
                    });
                }

                if (game.menuOverlayButtons.length > 0) {
                    game.menuOverlayButtons.forEach(button => {
                        button.blocked = false;
                        System.isBehindOverlay(mousePos, button, game.optionOverlays);
                        System.isInsideButton(mousePos, button);
                    });
                }

                if (game.optionOverlayButtons.length > 0) {
                    game.optionOverlayButtons.forEach(button => {
                        button.blocked = false;
                        System.isInsideButton(mousePos, button);
                    });
                }

                if (game.draggables.length > 0) {
                    game.draggables.forEach(object => {
                        object.blocked = false;
                        System.isInsideButton(mousePos, object);
                    });
                }
            }
        });
    }
}