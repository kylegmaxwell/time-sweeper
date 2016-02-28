'use strict';

var game;

function handleLoad() {
    var container = document.getElementById("divcontainer");
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var minesSpan = document.getElementById("minesDisplay");
    var timeSpan = document.getElementById("timeDisplay");
    var statusSpan = document.getElementById("statusDisplay");

    runTests();

    game = new Game(canvas, minesSpan, timeSpan, statusSpan);

    canvas.addEventListener('mousedown', function handleClick(e) {
        game.mouseDown(e.offsetX, e.offsetY);
    }, true);
    canvas.addEventListener('mouseup', function handleClick(e) {
        game.mouseUp(e.offsetX, e.offsetY);
    }, true);

    var ignore = function ignoreEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    canvas.oncontextmenu = ignore;
    var canvasRect = canvas.getBoundingClientRect();
    var canvasTop = canvasRect.top;
    var canvasLeft = canvasRect.left;

    var ongoingTouches = {};
    canvas.addEventListener("touchstart", function (e) {
        ignore(e);
        var touch = e.touches[0];
        ongoingTouches[touch.identifier] = touch;
        var x = touch.clientX - canvasLeft + 0.0 * touch.radiusX;
        var y = touch.clientY - canvasTop + 0.0 * touch.radiusY;

        game.mouseDown(x, y);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        ignore(e);
        for (var key in e.changedTouches) {
            var touch = e.changedTouches[key];
            if (ongoingTouches[touch.identifier]) {
                var x = touch.clientX - canvasLeft + 0.0 * touch.radiusX;
                var y = touch.clientY - canvasTop + 0.0 * touch.radiusY;
                game.mouseUp(x, y);
            }
        }
    }, false);

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

function doLogin() {
    window.location.pathname = '/auth/facebook'
}

function saveGame() {
    var gameState = JSON.stringify(game);
    postRequest('/save', gameState, function () {
        console.log(this.responseText);
    });
}

function postRequest(path, data, callback) {
    var xhr = new XMLHttpRequest();   // new HttpRequest instance
    xhr.addEventListener("load", callback);
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"data":data}));
}

function loadGame() {
    getRequest("/load", function () {
        if (this.responseText === 'Not logged in') {
            console.log(this.responseText);
        } else {
            var responseObj = JSON.parse(JSON.parse(this.responseText).data);
            game.reload(responseObj);
        }
    });
}

function getRequest(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", callback);
    xhr.open("GET", path);
    xhr.send();
}
