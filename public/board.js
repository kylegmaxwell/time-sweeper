'use strict';
/*
 * Created on Feb 13, 2016
 * @author Kyle Maxwell
 *
 * Class to represent one game board state
 */

class Board {

    // private Cell [][] grid;
    // private var dim;//dimension of cells
    // private var rows, cols;
    // private var time;
    // public static Random rnd = new Random();
    // public static final var shuffles=7;
    // public var mines,m;

    // public static final var LEFT=0,RIGHT=1,BOTH=2;
    // private boolean gameIsOver,victory;

    constructor(numRows, numCols, numMines, cellSize) {
        this._gameIsOver=false;
        this._victory=false;
        // this._colors = new Color[8];
        // for (var i=0;i<8;i++)
           // colors[i]=new Color(((i+4)%6)*50,((i+2)%5)*50,((i+3)%4)*50);
        // m=mines=numMines;
        // time=0;
        // dim=cellDimension;
        // The radius of a game cell in pixels
        this._cellSize = cellSize;
        // The amount of padding at the edge of the canvas
        this._margin =  Math.floor(cellSize * 0.4);
        this._numRows=numRows;
        this._numCols=numCols;
        // boolean [][] b = getMines();

        // grid = new Cell[rows][cols];
        this._grid = [];
        this._initGrid();

        // Create the mines in the first N cells in row major order
        if (numMines < 0 || numMines >= numRows * numCols) {
            throw new Error("Invalid number of mines.");
        }
        this._numMines = numMines;
        this._initMines();

        this._calculateNeighbors();
    }

    getCanvasWidth() {
        return this._numCols * this._cellSize + 2*this._margin;
    }

    getCanvasHeight() {
        return this._numRows * this._cellSize + 2*this._margin;
    }

    _initGrid() {
        for (var r=0;r<this._numRows;r++) {
            this._grid.push([]);
            for (var c=0;c<this._numCols;c++) {
                this._grid[r].push(new Cell(false));
                // grid[r][c]=new Cell(b[r][c]);
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
    // public var getM()
    // { return m; }
    // public boolean getGameOver()
    // {
    //     return gameIsOver;
    // }
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

    // //use Ms. Teukolsky's Friend's Shuffle algorithm
    // //swap each element with a random element
    // //(this is ment to be repeated more than once to achieve a good shuffle
    _shuffle() {
        console.log('TODO shuffle');
        //TODO
    //     boolean temp, i, j;
    //     var rr, cc;
    //     //swap each element with a random element
    //     for (var r=0;r<rows;r++)
    //         for (var c=0;c<cols;c++)
    //         {
    //             temp=arr[r][c];
    //             rr = rnd.nextInt(rows);
    //             cc = rnd.nextInt(cols);
    //             arr[r][c]=arr[rr][cc];
    //             arr[rr][cc]=temp;
    //         }
    }
    _calculateNeighbors() {
        // calculate the neighbor number of mines
        for (var r=0;r<this._numRows;r++)
        for (var c=0;c<this._numCols;c++) {
            var cell = this._grid[r][c];
            if (cell.isMined()) {
                for (var i=-1;i<2;i++)
                for (var j=-1;j<2;j++) {
                    // count the mine in each of its neighbors
                    if (this._inBounds(r+i, c+j)) {
                        var neighborCell=this._grid[r+i][c+j];
                        if (!neighborCell.isMined()) {
                            neighborCell.incNumMines();
                        }
                    }

                }
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

    draw(ctx, space, buffered) {
        var drawFunc = buffered ? 'drawBuffered' : 'drawImmediate';
        this._draw(ctx, space, drawFunc);
    }

    _draw(ctx, space, drawFunc) {
        var radius = this._cellSize-2*space;
        var x = this._margin+space;
        var y = this._margin+space;
        for (var r=0;r<this._numRows;r++) {
            for (var c=0;c<this._numCols;c++) {
                this._grid[r][c][drawFunc](ctx, x, y, radius, space);
                x+=this._cellSize;
            }
            y+=this._cellSize;
            x=this._margin+space;
        }
    }

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
            ctx.lineTo(x, this.getCanvasWidth() - this._margin)
            x+=this._cellSize;
        }

    }
    // public void paint(Graphics g)
    // {
    //     Color prev = g.getColor();
    //     paintRegular(g);
    //     if (gameIsOver)
    //         drawMines(g);
    //     g.setColor(prev);//restore old color
    // }
    // private void drawMines(Graphics g)
    // {
    //     var x=0, y=0;
    //     g.setColor(Color.BLACK);
    //     for (var r=0;r<rows;r++)
    //     {
    //         y+=dim;
    //         x=0;
    //         for (var c=0;c<cols;c++)
    //         {
    //             x+=dim;
    //             if (grid[r][c].getMine())
    //                 g.fillOval(x+1,y+1,dim-1,dim-1);
    //         }
    //     }
    // }
    // private void paintRegular(Graphics g)
    // {
    //     var x=0, y=0;
    //     for (var r=0;r<rows;r++)
    //     {
    //         y+=dim;
    //         x=0;
    //         for (var c=0;c<cols;c++)
    //         {
    //             x+=dim;
    //             g.setColor(Color.GRAY);

    //             //square has been clicked on
    //             if (grid[r][c].getClick())
    //             {
    //                 //draw blank
    //                 g.setColor(Color.LIGHT_GRAY);
    //                 g.fillRect(x,y,dim,dim);

    //                 g.setColor(Color.black);
    //                 g.setFont(new Font("Arial",0,dim-1));
    //                 if (grid[r][c].getMine())
    //                 {
    //                     g.fillOval(x+1,y+1,dim-1,dim-1);
    //                     g.setColor(Color.red);
    //                     g.drawLine(x,y,x+dim,y+dim);
    //                     g.drawLine(x,y+dim,x+dim,y);
    //                 }
    //                 else
    //                 {
    //                     var zero = grid[r][c].getNumMines();
    //                     if (zero!=0)
    //                     {
    //                         g.setColor(colors[zero-1]);
    //                         g.drawString(Integer.toString(zero),x+1,y+dim-1);
    //                     }
    //                 }
    //             }
    //             else
    //             {
    //                 if (grid[r][c].getFlag())
    //                 {
    //                     g.setColor(Color.RED);
    //                     g.fillRect(x,y,dim,dim);
    //                 }
    //                 else
    //                 {
    //                     g.setColor(Color.GRAY);
    //                     g.fillRect(x,y,dim,dim);
    //                 }
    //             }


    //             //draw box outline
    //             g.setColor(Color.BLACK);
    //             g.drawRect(x,y,dim,dim);
    //         }
    //     }
    // }

    /**
     * Determine what cell was clicked and update it
     * @param  {Number} x Click location in pixels
     * @param  {Number} y Click location in pixels
     */
    clickAt(x, y, operation) {
        var col = Math.floor((x-this._margin) / this._cellSize);
        var row = Math.floor((y-this._margin) / this._cellSize);
        if (this._inBounds(row, col)) {
            this._grid[row][col][operation]();
        }
    }
    // public boolean click(var e, var x, var y)
    // {
    //     if (getGameOver())
    //         return true;
    //     x-=dim;
    //     y-=(23+dim);
    //     x/=dim;
    //     y/=dim;
    //     Cell c = grid[y][x];
    //     //var b = e.getButton();
    //     if (e==5)
    //     {
    //         JOptionPane.showMessageDialog(null,c.getNumFlags()+","+c.getNumMines());
    //         return false;
    //     }
    //     if (e==BOTH)
    //     {
    //         if (c.getClick() && c.getNumFlags()==c.getNumMines())
    //         {
    //             for (var i=-1;i<2;i++)
    //                 for (var j=-1;j<2;j++)
    //                     try
    //                     {
    //                         if (click(grid[y+i][x+j],x+j,y+i))
    //                             return true;
    //                     }
    //                     catch (ArrayIndexOutOfBoundsException ex)
    //                     {}
    //         }
    //     }
    //     else if(e==RIGHT)
    //     {
    //         boolean flag = c.flag();

    //         if (!c.getClick())
    //         {
    //             if (flag)
    //                 m--;
    //             else
    //                 m++;
    //             for (var i=-1;i<2;i++)
    //                 for (var j=-1;j<2;j++)
    //                     try
    //                     {
    //                         if (flag)
    //                             grid[y+i][x+j].incNumFlags();
    //                         else
    //                             grid[y+i][x+j].decNumFlags();
    //                     }
    //                     catch (ArrayIndexOutOfBoundsException ex)
    //                     {}
    //         }
    //     }
    //     else if (e==LEFT)
    //     {
    //         if (click(c,x,y))
    //             return true;
    //     }
    //     return win();
    // }
    // private boolean win()
    // {
    //     //check for victory
    //     if (m==0)
    //     {
    //         for (var r=0;r<rows;r++)
    //             for (var c=0;c<cols;c++)
    //                 if (!grid[r][c].getClick() && !grid[r][c].getFlag())
    //                     return false;//might not be correct mine mapping
    //         gameIsOver=true;
    //         victory=true;
    //         return true;
    //     }
    //     return false;
    // }
    // private boolean click(Cell c, var x, var y)
    // {
    //     var click = c.click();
    //     if (click==Cell.MINE)
    //     {
    //         gameIsOver=true;
    //         return true;
    //     }
    //     if (click==0)
    //         clickHelp(x,y);
    //     return false;
    // }

    // private void clickHelp(var x, var y)
    // {
    //     for (var i=-1;i<2;i++)
    //         for (var j=-1;j<2;j++)
    //             try
    //             {
    //                 if (!grid[y+i][x+j].getClick() && grid[y+i][x+j].click()==0)
    //                     clickHelp(x+j,y+i);
    //             }
    //             catch (ArrayIndexOutOfBoundsException ex)
    //             {}

    // }
    // public boolean getVictory() {
    //     return victory;
    // }
}
