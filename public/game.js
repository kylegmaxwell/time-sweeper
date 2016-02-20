'use strict';

class Game {
    /**
     * Create and initialize a new game
     * @param  {2D Context} context 2D drawing context
     */
    constructor(context) {
        this._board = new Board(10,10,25,20);
        this._width=this._board.getCanvasWidth();
        this._height=this._board.getCanvasHeight();
        this._ctx = context;
        this.styleContext();
        this._t0 = performance.now();
        this._mouseTimeout = null;
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

    draw() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this.styleContext();

        // Set up the draw buffer
        // this._ctx.beginPath();
        // // Draw the covered cells
        // this._board.draw(this._ctx, 2, true);
        // // Render all the circles that were added to the buffer
        // this._ctx.fill();

        this._ctx.strokeStyle = '#666666';
        this._ctx.lineWidth= 0;
        this._ctx.lineCap= 'square';

        // Draw the clicked cell's contents
        this._board.draw(this._ctx, 1, false);

        this._ctx.beginPath();
        this._board.drawLines(this._ctx);
        this._ctx.stroke();


    }
    /**
     * If there is a pending click cancel it and return true
     * @return {Boolean} Whether the timeout was canceled
     */
    _clearTimeout () {

        if (this._mouseTimeout != null) {
            clearTimeout(this._mouseTimeout);
            this._mouseTimeout = null;
            return true;
        }
        return false;
    }

    mouseDown(x, y) {
        var _this = this;
        this._clearTimeout();
        this._mouseTimeout = setTimeout(function () {
            _this._board.clickAt(x, y, 'flag');
            _this.draw();
            _this._mouseTimeout = null;
        }, 500);
    }

    mouseUp(x, y) {

        if (this._clearTimeout()) {
            this._board.clickAt(x, y, 'explore');
        }
        this.draw();
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