'use strict';

function handleLoad() {
    var container = document.getElementById("divcontainer");
    // var game = setup(container);
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var minesSpan = document.getElementById("minesDisplay");
    var timeSpan = document.getElementById("timeDisplay");
    var statusSpan = document.getElementById("statusDisplay");

    runTests();

    var game = new Game(canvas, minesSpan, timeSpan, statusSpan);

    canvas.addEventListener('mousedown', function handleClick(e) {
        game.mouseDown(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseup', function handleClick(e) {
        game.mouseUp(e.offsetX, e.offsetY);
    });

    canvas.width = game.getWidth();
    canvas.height = game.getHeight();

    game.render();

    var diff = document.getElementById("difficultSelector");
    diff.addEventListener('input', function(evt) {
        var difficuly = parseInt(this.value);
        game.reset(difficuly);
        canvas.width = game.getWidth();
        canvas.height = game.getHeight();
        game.render();
    });
}

function runTests() {
    var tests = new Tests();
    tests.run();
}