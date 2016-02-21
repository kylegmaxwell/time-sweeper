'use strict';
/**
 * Class to represent a cell in the game.
 * Generally this contains some data, like whether there is a mine
 */
class Cell {
    constructor() {
        /**
         * If the user has flagged this as a potential mine
         * @type {Boolean}
         */
        this._isFlagged = false;

        /**
         * Whether the user has clicked this cell
         * @type {Boolean}
         */
        this._isClicked = false;

        /**
         * Whether the cell has a mine in it
         * @type {Boolean}
         */
        this._isMined = false;

        /**
         * Number of flagged neighboring mines
         * @type {Number}
         */
        this._neighborFlags = 0;

        /**
         * number of neighbors which contain mines
         * @type {Number}
         */
        this._neighborMines = 0;

    }

    /**
     * Color array for different mine numbers
     * @param  {Number} i Which color to get
     * @return {String}   html color
     */
    static getColor(i) {
        var colors = ['blue','green','red','deeppink','cyan','yellow','orange','pink'];
        return colors[i];
    }

    /**
     * @return Boolean True if this cell is a mine
     */
    isMined() {
        return this._isMined;
    }

    setMine() {
        this._isMined = true;
    }

    /**
     * @return { Boolean } True if this cell was flagged by user.
     */
    isFlagged() {
        return this._isFlagged;
    }

    /**
     * @return { Boolean } True if the user has clicked on this cell
     */
    isClicked() {
        return this._isClicked;
    }

    /**
     * Increment number adjacent mines
     */
    incNumMines() {
        this._neighborMines++;
    }

    /**
     * Update the number of neighboring flags
     */
    changeNumFlags(delta) {
        this._neighborFlags += delta;
    }

    /**
     * Add or remove a flag
     * @return {Number} Change in the number of flagged mines
     */
    flag() {
        var delta = 0;
        if (this._isClicked)
            return delta;
        this._isFlagged =! this._isFlagged;
        if (this._isMined) {
            delta = this._isFlagged ? 1 : -1
        }
        return delta;
    }

    /**
     * click on mine
     * @return {Number} mine Value
     */
    explore() {
        if (!this._isFlagged)
            this._isClicked=true;
        // else
            // return -999;//bad value (avoid(0=empty,-1=mine))
        return this.isSatisfied();
    }

    /**
     * Determine if all neighboring mines have been found
     * @return {Boolean} True if satisfied
     */
    isSatisfied() {
        return (this._neighborFlags === this._neighborMines) && !this._isMined;
    }

    /**
     * Return whether the user clicked and blew up
     * @return {Boolean} True if you lose
     */
    isExploded() {
        return this._isClicked && this._isMined;
    }

    /**
     * Query the number of mines that neighbor the cell
     * @return {Number} The number of neighboring mines
     */
    getNumMines() {
        return this._neighborMines;
    }

    /**
     * Draw the icons in immediate mode
     * @param  {2d} ctx drawing context
     * @param  {Number} x   position
     * @param  {Number} y   position
     * @param  {Number} r   radius
     * @param  {Number} s   extra space at cell border
     */
    draw(ctx, x, y, r, s) {
        if (this.isClicked()) {
            if (this.isMined()) {
                ctx.drawImage(bombImg, x, y, r, r);
            } else if (this._neighborMines > 0) {
                ctx.fillStyle = Cell.getColor(this._neighborMines-1);
                ctx.fillText(''+this._neighborMines, x+3, y+r-1);
            }
        } else {
            ctx.drawImage(tileImg, 0, 0, 17, 17, x, y, r, r);
            if (this.isFlagged()) {
                ctx.drawImage(flagImg, x+s, y+s, r-2*s, r-2*s);
            }
        }
    }

    drawReveal(ctx, x, y, r, s) {
        if (!this.isClicked()) {
            ctx.drawImage(tileImg, 0, 0, 17, 17, x, y, r, r);

        }
        if (this.isMined()) {
            ctx.drawImage(bombImg, x, y, r, r);
        } else if (this._neighborMines > 0) {
            ctx.fillStyle = Cell.getColor(this._neighborMines-1);
            ctx.fillText(''+this._neighborMines, x+3, y+r-1);
        }

        if (this.isFlagged()) {
            ctx.drawImage(flagImg, x+s, y+s, r-2*s, r-2*s);
        }
    }
}