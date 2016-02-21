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
        this.setup(Game.getLevel(0));
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
     * Set up the board for a new game
     * @param  {Array} level [numRows, numCols, numMines]
     */
    setup(level) {
        var cellSize = 20;
        this._board = new Board(level[0], level[1], level[2], 20);
        this._width=this._board.getCanvasWidth();
        this._height=this._board.getCanvasHeight();
        this.styleContext();
        this._t0 = performance.now();
        this._mouseTimeoutCallback = null;
        this._mouseTimeDelay = 300;
        this._time = -1;
        this._timeSpan.textContent = this._time;
        this._setupTimer();
    }

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

    reset(difficulty) {
        console.log('reset', difficulty);
        this.setup(Game.getLevel(difficulty));
    }

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

    click(x, y) {
        this._board.click(x, y);
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }
}