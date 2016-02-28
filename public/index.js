'use strict';

var game;

/**
 * Main function that runs onLoad for the page
 */
function handleLoad() {
    var minesSpan = document.getElementById("minesDisplay");
    var timeSpan = document.getElementById("timeDisplay");
    var statusSpan = document.getElementById("statusDisplay");

    runTests();

    game = new Game(gameCanvas, minesSpan, timeSpan, statusSpan);

    // Handle mouse events
    gameCanvas.addEventListener('mousedown', function handleClick(e) {
        game.mouseDown(e.offsetX, e.offsetY);
    }, true);
    gameCanvas.addEventListener('mouseup', function handleClick(e) {
        game.mouseUp(e.offsetX, e.offsetY);
    }, true);

    var ignore = function ignoreEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // Handle touch events
    gameCanvas.oncontextmenu = ignore;
    var canvasRect = gameCanvas.getBoundingClientRect();
    var canvasTop = canvasRect.top;
    var canvasLeft = canvasRect.left;

    var ongoingTouches = {};
    gameCanvas.addEventListener("touchstart", function (e) {
        ignore(e);
        var touch = e.touches[0];
        ongoingTouches[touch.identifier] = touch;
        var x = touch.clientX - canvasLeft + 0.0 * touch.radiusX;
        var y = touch.clientY - canvasTop + 0.0 * touch.radiusY;

        game.mouseDown(x, y);
    }, false);
    gameCanvas.addEventListener("touchend", function (e) {
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

    resizeCanvas();

    difficultSelector.addEventListener('input', function(evt) {
        var difficuly = parseInt(this.value);
        game.reset(difficuly);
        resizeCanvas();
    });

    checkLogin();
}

/**
 * Reset the game when the user wants to start over.
 */
function resetGame() {
    var difficuly = parseInt(difficultSelector.value);
    game.reset(difficuly);
    resizeCanvas();
}

/**
 * Helper function to resize canvas and render
 */
function resizeCanvas() {
    gameCanvas.width = game.getWidth();
    gameCanvas.height = game.getHeight();
    game.render();
}

/**
 * Run the client tests
 * Output prints to console
 */
function runTests() {
    var tests = new Tests();
    tests.run();
}

/**
 * Update UI according to login state.
 * Save and load buttons are disabled unless logged in.
 */
function checkLogin() {
    loadButton.disabled = true;
    saveButton.disabled = true;

    getRequest("/me", function () {
        if (this.responseText !== '') {
            loadButton.disabled = false;
            saveButton.disabled = false;
        }
    });
}
/**
 * Navigate to the authentication route
 * The server then redirects to facebook.
 * After successful auth, the user is redirected back.
 */
function doLogin() {
    window.location.pathname = '/auth/facebook'
}

/**
 * Post the game data to the server via xhr.
 */
function saveGame() {
    saveButton.disabled = true;
    var gameState = JSON.stringify(game);
    postRequest('/save', gameState, function () {
        console.log(this.responseText);
        saveButton.disabled = false;
    });
}

/**
 * Helper function for POST requests
 * @param  {String}   path     Path to the API endpoint
 * @param  {String}   data     The payload for the request body
 * @param  {Function} callback Function to execute on request completion
 */
function postRequest(path, data, callback) {
    var xhr = new XMLHttpRequest();   // new HttpRequest instance
    xhr.addEventListener("load", callback);
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"data":data}));
}

/**
 * Get the game data from the server via xhr.
 */
function loadGame() {
    loadButton.disabled = true;
    getRequest("/load", function () {
        if (this.responseText === 'Not logged in') {
            console.log(this.responseText);
        } else {
            var responseObj = JSON.parse(JSON.parse(this.responseText).data);
            game.reload(responseObj);
            resizeCanvas();
        }
        loadButton.disabled = false;
    });
}

/**
 * Helper function for GET requests.
 * @param  {String}   path     Path to the API endpoint.
 * @param  {Function} callback The function to execute on request completion
 */
function getRequest(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", callback);
    xhr.open("GET", path);
    xhr.send();
}
