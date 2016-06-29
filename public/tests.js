'use strict';

class Tests {

    /**
     * Fixture data for test runs
     * To make a board use this data change game.js:debugIndex
     */
    static getTest(index) {

        var mineFixtures = [
            [
                [0, 0, 0, 1, 0],
                [1, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0]
             ],
            [
                [0, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 1],
                [0, 0, 1, 0]
            ]
        ];

        return mineFixtures[index];
    }

    run () {
        console.log('Beginning Tests');
        this._cellSize = 20;
        this.test0();
        this.test1();
        this.test2();
        this.test3();
        console.log('Tests Completed');
    }


    test0() {
        console.log('Test 0');
        var mines = Tests.getTest(0);
        var board = new Board(mines.length, mines[0].length, mines, this._cellSize);
        Tests.expect(board.gameIsOver() === false);
        Tests.expectEqual(board._numRows, 4);
        Tests.expectEqual(board._numCols, 5);
        Tests.expectEqual(board._grid[0][3].isMined(), true);

        // Check that explore propagates but not too far.
        // board.doExplore(board._margin+4*cellSize+1, board._margin+3*cellSize+1);
        board.exploreIndex(3, 4);
        Tests.expectEqual(board._grid[3][4].isClicked(), true);
        Tests.expectEqual(board._grid[2][4].isClicked(), true);
        Tests.expectEqual(board._grid[3][3].isClicked(), true);
        Tests.expectEqual(board._grid[3][2].isClicked(), false);
    }

    test1() {
        console.log('Test 1');
        var mines = Tests.getTest(1);
        var board = new Board(mines.length, mines[0].length, mines, this._cellSize);
        Tests.expect(board.gameIsOver() === false);
        Tests.expectEqual(board._numRows, 4);
        Tests.expectEqual(board._numCols, 4);
        Tests.expectEqual(board._grid[0][1].isMined(), true);

        // Check that explore flood fill can end game when flags are wrong
        board.exploreIndex(0, 3);
        board.flagIndex(1, 1);
        board.exploreIndex(0, 2);
        Tests.expect(board.gameIsOver() === true);
    }

    test2() {
        console.log('Test 2');
        var mines = Tests.getTest(2);
        var board = new Board(mines.length, mines[0].length, mines, this._cellSize);
        Tests.expect(board.gameIsOver() === false);
        Tests.expectEqual(board._numRows, 5);
        Tests.expectEqual(board._numCols, 9);
        Tests.expectEqual(board._grid[2][6].isMined(), true);

        board.exploreIndex(4, 8);
        Tests.expectEqual(board._grid[2][6].isClicked(), false);
        Tests.expectEqual(board._grid[2][7].isClicked(), true);
        Tests.expectEqual(board._grid[2][7].isSatisfied(), false);
        board.flagIndex(2, 6);
        Tests.expectEqual(board._grid[2][6].isFlagged(), true);
        Tests.expectEqual(board._grid[2][7].isFlagged(), false);
        Tests.expectEqual(board._grid[2][7].isSatisfied(), true);

        // Check that flagging empty cells has no effect
        board.flagIndex(2, 7);
        Tests.expectEqual(board._grid[2][6].isFlagged(), true);
        Tests.expectEqual(board._grid[2][6].isClicked(), false);
        Tests.expectEqual(board._grid[2][7].isFlagged(), false);
        Tests.expectEqual(board._grid[2][7].isClicked(), true);
        Tests.expectEqual(board._grid[2][7].isSatisfied(), true);

        // Check that flood clicking satisfied cell clears neighbors
        Tests.expectEqual(board._grid[1][6].isClicked(), false);
        board.exploreIndex(2, 7);
        Tests.expectEqual(board._grid[1][6].isClicked(), true);
    }

    // This came up when a bug was discovered where, if you click
    // on a mine as the last click it erroneously marks it as a victory
    test3() {
        console.log('Test 3');
        var mines = Tests.getTest(3);
        var board = new Board(mines.length, mines[0].length, mines, this._cellSize);

        // Check that explore flood fill can end game when flags are wrong
        board.exploreIndex(0, 0);
        Tests.expect(board.gameIsOver() === false);
        board.exploreIndex(2, 3);
        Tests.expect(board.gameIsOver() === true);
        Tests.expect(board.getVictory() === false);
    }

    static expectEqual(a, b) {
        var message = 'Expected '+b+' but got '+a;
        Tests.expect(a === b, message);
    }

    static expect(statement, message) {
        message = message || 'Test failed';
        if (!statement) {
            throw new Error(message);
        }
    }
}