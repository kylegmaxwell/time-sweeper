'use strict';
// /**
//  * Class to represent a cell in the game.
//  * Generally this contains some data, like whether there is a mine
//  */
// var bomb;

class Cell {// public Color [] colors;
    //         //;
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

        this._isMined = false;

        /**
         * number of flagged neighbors
         * @type {Number}
         */
        this._neighborFlags = 0;

        /**
         * number of neighbors which contain mines
         * @type {Number}
         */
        this._neighborMines = 0;

    }

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
     * @return { Number } The number of flagged neighbors
     */
    getNumFlags() {
        return this._neighborFlags;
    }


    /**
     * set number adjacent mines
     * @param {Number} Number of adjacent mines
     */
    setNumMines(num) {
        this._neighborMines = num;
    }

    incNumMines() {
        this._neighborMines++;
    }

    incNumFlags() {
        this._neighborFlags++;
    }

    decNumFlags() {
        this._neighborFlags--;
    }

    //add or remove a flag
    //return true when a flag is added
    // @ return boolean
    flag() {
        if (this._isClicked)
            return false;
        this._isFlagged =! this._isFlagged;
        return this._isFlagged;
    }

    //click on mine
    //@ return Number mine Value
    explore() {
        if (!this._isFlagged)
            this._isClicked=true;
        // else
            // return -999;//bad value (avoid(0=empty,-1=mine))
        return this._mines;
    }

    isExploded() {
        return this._isClicked && this._isMined;
    }

    // @reuturn Number
    getNumMines() {
        return this._neighborMines;
    }

    // _initSprites() {
    //     if (!bomb) {
    //         bomb = document.getElementById("bomb");
    //     }
    // }
    /**
     * Draw the node as a circle.
     *
     * Assumes that ctx.beginPath() and ctx.fill() are called externally.
     * See http://www.html5rocks.com/en/tutorials/canvas/performance/#toc-batch
     *
     * @param  {ctx} The 2d context on which to draw
     * @param  {Number} x The horizontal draw position
     * @param  {Number} y The vertical draw position
     * @param  {Number} width The horizontal separation to prevent drawn nodes form overlapping
     */
    drawBuffered(ctx, x, y, r) {

        // Call moveTo to update the cursor so a polygon is not created across circles
        ctx.moveTo(x,y);

        // Specify the arc to draw (it will actually be visible when fill is called)
        // ctx.arc(x, y, r, 0, 2*Math.PI);
        if (!this.isClicked()) {
            // ctx.rect(x, y, r, r);// 0, 2*Math.PI);
                // ctx.drawImage(tile, x, y, r, r);
                ctx.drawImage(tile, 0, 0, 17, 17, x-1, y-1, r+2, r+2);
        }
    }

    /**
     * Draw the icons in immediate mode
     * @param  {2d} ctx drawing context
     * @param  {Number} x   position
     * @param  {Number} y   position
     * @param  {Number} r   radius
     * @param  {Number} s   extra space at cell border
     */
    drawImmediate(ctx, x, y, r, s) {
        if (this.isClicked()) {
            if (this.isMined()) {
                ctx.drawImage(bomb, x, y, r, r);
            } else if (this._neighborMines > 0) {
                ctx.fillStyle = Cell.getColor(this._neighborMines-1);
                ctx.fillText(''+this._neighborMines, x+3, y+r-1);
            }
        } else {
            ctx.drawImage(tile, 0, 0, 17, 17, x, y, r, r);
            if (this.isFlagged()) {
                ctx.drawImage(flag, x+s, y+s, r-2*s, r-2*s);
            }
        }
    }

}