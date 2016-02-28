'use strict';
/*
 * Created on Feb 13, 2016
 * @author Kyle Maxwell
 *
 * Class to represent one game board state
 */
class Board {
    constructor(numRows, numCols, numMines, cellSize) {
        this._gameIsOver=false;
        this._victory=false;

        // The radius of a game cell in pixels
        this._cellSize = cellSize;
        // The amount of padding at the edge of the canvas
        this._margin =  Math.floor(cellSize * 0.4);
        this._numRows=numRows;
        this._numCols=numCols;

        this._initGrid();

        if (numMines.constructor === Array) {
            this._numMines = this._initMinesFromArray(numMines);
        } else {
            this._numMines = numMines;
            // Create the mines in the first N cells in row major order
            if (this._numMines < 0 || this._numMines >= numRows * numCols) {
                throw new Error("Invalid number of mines.");
            }
            this._initMines();
        }

        // The number of mines with flags on them
        this._numFlaggedMines = 0;

        // The number of covered tiles that could contain mines
        this._numTilesRemaining = this._numRows * this._numCols - this._numMines;

        // The total number of flags on the board
        this._numFlags = 0;

        this._calculateNeighbors();
    }

    /**
     * Determine what data to serialize for game saving
     * @return {Object} Serializeable object
     */
    toJSON() {
        return {
            _gameIsOver: this._gameIsOver,
            _victory: this._victory,
            _cellSize: this._cellSize,
            _margin: this._margin,
            _numRows: this._numRows,
            _numCols: this._numCols,
            _numMines: this._numMines,
            _numFlaggedMines: this._numFlaggedMines,
            _numTilesRemaining: this._numTilesRemaining,
            _numFlags: this._numFlags,
            _grid: this._grid
        };
    }

    /**
     * Replace the game state with data from a loaded game
     * @param  {Object} data The full game state
     */
    reload(data) {
        this._cellSize = data._cellSize;
        this._gameIsOver = data._gameIsOver;
        this._victory = data._victory
        this._margin = data._margin;
        this._margin = data._margin
        this._numFlaggedMines = data._numFlaggedMines;
        this._numFlags = data._numFlags;
        this._numMines = data._numMines;
        this._numTilesRemaining = data._numTilesRemaining;
        this._numRows = data._numRows;
        this._numCols = data._numCols;
        this._initGrid();
        this._reloadGrid(data._grid);
    }

    /**
     * Create a non-random board from input data
     * @param  {Array.<Array.<Number>>} mines Square array of mines
     * @return {Number}       The number of mines in the array
     */
    _initMinesFromArray(mines) {
        var count = 0;
        // var mines = this._numMines;
        for (var r=0;r<this._numRows;r++) {
            for (var c=0;c<this._numCols;c++) {
                if (mines[r][c] === 1) {
                    this._grid[r][c].setMine();
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Calculate the size of the canvas required to render this board
     * @return {Number} The width, in pixels
     */
    getCanvasWidth() {
        return this._numCols * this._cellSize + 2*this._margin;
    }

    /**
     * Calculate the size of the canvas required to render this board
     * @return {Number} The height, in pixels
     */
    getCanvasHeight() {
        return this._numRows * this._cellSize + 2*this._margin;
    }

    /**
     * Create an empty grid of cells to store the board state
     */
    _initGrid() {
        this._grid = [];
        for (var r=0;r<this._numRows;r++) {
            this._grid.push([]);
            for (var c=0;c<this._numCols;c++) {
                this._grid[r].push(new Cell());
            }
        }
    }

    /**
     * Replace the cell contents with data from a loaded game
     * @param  {Array} gridData 2D Array of objects containing cell data
     */
    _reloadGrid(gridData) {
        for (var r=0;r<this._numRows;r++) {
            for (var c=0;c<this._numCols;c++) {
                this._grid[r][c].reload(gridData[r][c]);
            }
        }
    }
    /**
     * Determine if the coordinates are in the grid
     * @param  {Number} r The row to check
     * @param  {Number} c The column to check
     * @return {Boolean}   Whether the coordinates are valid
     */
    _inBounds(r, c) {
        return r >= 0 && r < this._numRows && c >= 0 && c < this._numCols;
    }

    /**
     * Fill the first cells with the given number of mines, then shuffle them.
     */
    _initMines()
    {
        var mines = this._numMines;
        for (var r=0;r<this._numRows && mines>0;r++) {
            for (var c=0;c<this._numCols && mines>0;c++) {
                if (mines>0) {
                    mines--;
                    this._grid[r][c].setMine();
                }
            }
        }
        var shuffles = 7;
        for (var i=0;i<shuffles;i++) {
            this._shuffle();
        }
    }

    /**
     * Return a random number between 0 and range
     * @param  {Number} range The maximum value exclusive
     * @return {Number}       A random natural number
     */
    _randInt(range) {
        return Math.floor((Math.random() * range));

    }

    /**
     * Use Ms. Teukolsky's Friend's Shuffle algorithm
     * swap each element with a random element
     * (this is ment to be repeated more than once to achieve a good shuffle
     */
    _shuffle() {
        var temp, i, j, rr, cc;
        //swap each element with a random element
        for (var r=0;r<this._numRows;r++)
            for (var c=0;c<this._numCols;c++)
            {
                var temp=this._grid[r][c];
                rr = this._randInt(this._numRows);
                cc = this._randInt(this._numCols);
                this._grid[r][c]=this._grid[rr][cc];
                this._grid[rr][cc]=temp;
            }
    }

    _calculateNeighbors() {
        // calculate the neighbor number of mines
        for (var r=0;r<this._numRows;r++)
        for (var c=0;c<this._numCols;c++) {
            var cell = this._grid[r][c];
            if (cell.isMined()) {
                cell.incNumMines();
                this._neighborFill(r, c, function (r, c, cell) {
                    cell.incNumMines();
                });
            }
        }
    }

    /**
     * Convert the board to a string for display
     * @return {String} The rendered board
     */
    toString() {
        var str = '';
        for (var r=0;r<this._numRows;r++) {
            for (var c=0;c<this._numCols;c++) {
                if (this._grid[r][c].isMined()) {
                    str = str+'X';
                } else {
                    str = str+'.';
                }
            }
            str = str + '\n';
        }
        return str;
    }

    /**
     * Draw the board
     * @param  {2D} ctx         Drawing context
     * @param  {Number} space   Amount of space between tiles
     */
    draw(ctx, space) {
        var radius = this._cellSize-2*space;
        var x = this._margin+space;
        var y = this._margin+space;
        var drawFunc = this._gameIsOver ? 'drawReveal' : 'draw';
        for (var r=0;r<this._numRows;r++) {
            for (var c=0;c<this._numCols;c++) {
                this._grid[r][c][drawFunc](ctx, x, y, radius, space);
                x+=this._cellSize;
            }
            y+=this._cellSize;
            x=this._margin+space;
        }
    }

    /**
     * Draw the border lines between the cells
     * @param  {2D} ctx The drawing context
     */
    drawLines (ctx) {
        var y = this._margin;
        for (var r=0;r<=this._numRows;r++) {
            ctx.moveTo(this._margin, y);
            ctx.lineTo(this.getCanvasWidth() - this._margin, y)
            y+=this._cellSize;
        }
        var x = this._margin;
        for (var c=0;c<=this._numCols;c++) {
            ctx.moveTo(x, this._margin);
            ctx.lineTo(x, this.getCanvasHeight() - this._margin)
            x+=this._cellSize;
        }
    }

    /**
     * Perform some user action given at some coordinates
     * @param  {Number} x    The screen space horizontal position
     * @param  {Number} y    The screen space vertical position
     * @param  {Number}} func The callback to execute on the cell at the given coordinates
     */
    getCellFromScrenSpace(x, y, func) {
        var col = Math.floor((x-this._margin) / this._cellSize);
        var row = Math.floor((y-this._margin) / this._cellSize);
        var cell = null
        if (this._inBounds(row, col)) {
            cell = this._grid[row][col];
        }
        if (cell) {
            func(row, col, cell);
        }
    }

    /**
     * Helper function to flag a given cell
     * @param  {Number} row  The row of the cell
     * @param  {Number} col  The column of the cell
     * @param  {Cell} cell The cell to flag
     */
    _handleFlag(row, col, cell) {
        var result = cell.flag();
        // First record just whether the flag was right
        this._numFlaggedMines += result;
        // Then record the user's choices
        var userDelta = cell.isFlagged() ? 1 : -1;
        this._numFlags += userDelta;
        this._neighborFill(row, col, function (r, c, cell) {
            cell.changeNumFlags(userDelta);
        });

    }

    /**
     * Flag a cell given by index.
     * Used by tests to emulate user actions.
     * @param  {Number} row The row of the clicked cell.
     * @param  {Number} col The column of the clicked cell.
     */
    flagIndex(row, col) {
        if (this._gameIsOver || !this._inBounds(row, col)) return;
        this._handleFlag(row, col, this._grid[row][col]);
    }

    /**
     * Flag or un-flag a cell at the given coordinates as a mine
     * @param  {Number} x Click location in pixels
     * @param  {Number} y Click location in pixels
     */
    doFlag(x, y) {
        if (this._gameIsOver) return;
        this.getCellFromScrenSpace(x, y, this._handleFlag.bind(this));
    }

    /**
     * Explore a cell and track the number remaining
     * @param  {Cell} cell  The cell to explore
     * @return {Boolean}    Whether the cell is satisfied
     */
    _exploreCell(cell) {
        if (!cell) return;
        // if the cell will change state when explored
        if (!cell.isClicked() && !cell.isFlagged()) {
            this._numTilesRemaining--;
            if (this._numTilesRemaining < 1) {
                this._gameIsOver = true;
                this._victory = true;
            }
        }
        var result = cell.explore();
        if (cell.isExploded()) {
            this._gameIsOver = true;
        }
        return result;
    }

    /**
     * Helper function to explore on a given cell
     * @param  {Number} row  The row of the cell
     * @param  {Number} col  The column of the cell
     * @param  {Cell} cell The cell to explore
     */
    _handleExplore (row, col, cell) {
        var wasExplored = cell.isClicked();
        this._exploreCell(cell);
        if ((cell.getNumMines() === 0 || wasExplored) && cell.isSatisfied()) {
            this._floodFill(row, col);
        }
    }

    /**
     * Explore a cell at the given coordinates to see what's there
     * @param  {Number} x Click location in pixels
     * @param  {Number} y Click location in pixels
     */
    doExplore(x, y) {
        if (this._gameIsOver) return;
        this.getCellFromScrenSpace(x, y, this._handleExplore.bind(this));
    }

    /**
     * Explore a cell given by index.
     * Used by tests to emulate user actions.
     * @param  {Number} row The row of the clicked cell.
     * @param  {Number} col The column of the clicked cell.
     */
    exploreIndex(row, col) {
        if (this._gameIsOver || !this._inBounds(row, col)) return;
        this._handleExplore(row, col, this._grid[row][col]);
    }

    /**
     * Apply some operation to all the neighbors of a cell at given index coordinates
     * @param  {Number} r    Cell row
     * @param  {Number}} c    Cell column
     * @param  {Function} func Callback to execute on neighbors
     */
    _neighborFill(r, c, func) {
        if (!this._inBounds(r, c)) return;
        // For each neighbor
        for (var i=-1;i<2;i++)
            for (var j=-1;j<2;j++) {
                // count the mine in each of its neighbors
                if (this._inBounds(r+i, c+j)) {
                    func(r+i, c+j, this._grid[r+i][c+j]);
                }
            }
    }

    /**
     * Explore this cell and it's satisfied neighbors recursively
     * @param  {[type]} r [description]
     * @param  {[type]} c [description]
     * @return {[type]}   [description]
     */
    _floodFill(r, c) {
        if (!this._inBounds(r, c)) return;
        var cell = this._grid[r][c];
        var _this = this;
        if (cell.isSatisfied()) {
            var func = function exploreNeighbors(r, c, cell) {
                if (!cell.isClicked() && _this._exploreCell(cell) && (cell.getNumMines() === 0)) {
                    _this._floodFill(r, c);
                }
            };
            this._neighborFill(r, c, func);
        }
    }

    /**
     * Get the remaining mines number to display in the UI.
     * This is not the actual number of mines remaining.
     * It is how many mines there would be if the flags are all correct.
     * @return {Number} How many mines
     */
    getNumDisplayMines() {
        return this._numMines - this._numFlags;
    }

    /**
     * Tell whether you won yet.
     * @return {Boolean} True if win.
     */
    getVictory() {
        return this._victory;
    }

    /**
     * Tell if the game is over, win or lose.
     * @return {Boolean} The game has ended.
     */
    gameIsOver() {
        return this._gameIsOver;
    }
}
