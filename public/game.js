'use strict';

class Game {
    /**
     * Create and initialize a new game
     * @param  {2D Context} context 2D drawing context
     */
    constructor(canvas, minesSpan, timeSpan, statusSpan) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');;
        this._minesSpan = minesSpan;
        this._statusSpan = statusSpan;
        this._timeSpan = timeSpan;
        this._cellSize = 20;
        this.setup(Game.getLevel(0), false);
    }

    /**
     * Return the game settings for a certain difficulty level
     * @param  {Number} index   The level
     * @return {Array}          Rows, cols, mines
     */
    static getLevel(index) {
        var levels = [[9,9,10],[16,16,40],[16,30,99]];
        return levels[index];
    }

    /**
     * Create the board of the given size and mines
     * @param  {Boolean} debug If true, will use the test data instead of a random board
     */
    _createBoard(level, debug) {
        if (!debug) {
            this._board = new Board(level[0], level[1], level[2], this._cellSize);
        } else {
            var mines = Tests.getTest(1);
            this._board = new Board(mines.length, mines[0].length, mines, this._cellSize);
        }
    }
    /**
     * Set up the board for a new game
     * @param  {Array} level [numRows, numCols, numMines]
     */
    setup(level, debug) {
        var cellSize = 20;
        this._createBoard(level, debug);
        this._width=this._board.getCanvasWidth();
        this._height=this._board.getCanvasHeight();
        this.styleContext();
        this._mouseTimeoutCallback = null;
        this._mouseTimeDelay = 300;
        this._time = -1;
        this._timeSpan.textContent = this._time;
        this._setupTimer();
    }

    /**
     * Start a timeout loop that will update the html timer span
     * @return {[type]} [description]
     */
    _setupTimer() {
        var _this = this;
        var updateTimer = function () {
            if (_this._board.gameIsOver()) return;
            _this._time++;
            _this._timeSpan.textContent = _this._time;
            setTimeout(function() {
                updateTimer();
            },1000);
            // TODO might need to cancel timer on reset
        }
        updateTimer();
    }

    /**
     * @param  {DomElement} The div into which the canvas goes
     */
    styleContext() {
        this._ctx.shadowBlur=3;
        this._ctx.shadowColor='#777777';
        this._ctx.shadowOffsetX=1;
        this._ctx.shadowOffsetY=1;
        this._ctx.fillStyle = '#BBBBBB';
        this._ctx.font = '18px Monaco';
    }

    /**
     * Update html and draw canvas
     */
    render() {
        this._draw();
        this._minesSpan.textContent = this._board.getNumDisplayMines();
        if (this._board.gameIsOver()) {
            if (this._board.getVictory()) {
                this._statusSpan.textContent = "YOU WIN";
                this._canvas.setAttribute('status', 1);
            } else {
                this._statusSpan.textContent = "YOU LOSE";
                this._canvas.setAttribute('status', -1);
            }
        }
    }

    /**
     * Start a new game by creating a new board
     * @param  {Number} difficulty The difficulty index
     */
    reset(difficulty) {
        this.setup(Game.getLevel(difficulty));
    }

    /**
     * Redraw the canvas to show the updated game state.
     */
    _draw() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this.styleContext();

        this._ctx.strokeStyle = '#666666';
        this._ctx.lineWidth= 0;
        this._ctx.lineCap= 'square';

        // Draw the clicked cell's contents
        this._board.draw(this._ctx, 1);

        this._ctx.beginPath();
        this._board.drawLines(this._ctx);
        this._ctx.stroke();

    }

    /**
     * If there is a pending click cancel it and return true
     * @return {Boolean} Whether the timeout was canceled
     */
    _clearTimeout () {

        if (this._mouseTimeoutCallback != null) {
            clearTimeout(this._mouseTimeoutCallback);
            this._mouseTimeoutCallback = null;
            return true;
        }
        return false;
    }

    mouseDown(x, y) {
        var _this = this;
        this._clearTimeout();
        this._mouseTimeoutCallback = setTimeout(function () {
            _this._board.doFlag(x, y);
            _this.render();
            _this._mouseTimeoutCallback = null;
        }, this._mouseTimeDelay);
    }

    mouseUp(x, y) {

        if (this._clearTimeout()) {
            this._board.doExplore(x, y);
        }
        this.render();
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    toString() {
        return this._board.toString();
    }

    toJSON() {
        return {
            "_cellSize": this._cellSize,
            "_time": this._time,
            "_width": this._width,
            "_height": this._height,
            "_board": this._board.toJSON()
        };
    }

    reload(data) {
        this._time = data._time;
        //TODO
        console.log('TODO read other properties');
    }
}