'use strict';

/**
 * @param  {DomElement} The div into which the canvas goes
 */
function setup(container) {
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var game = new Game(ctx);

    // var t0 = performance.now();
    canvas.addEventListener('mousedown', function handleClick(e) {
        game.mouseDown(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseup', function handleClick(e) {
        game.mouseUp(e.offsetX, e.offsetY);
        // game.click(e.offsetX, e.offsetY);
        // game.draw();
    });

    canvas.width = game.getWidth();
    canvas.height = game.getHeight();

    game.draw();
}