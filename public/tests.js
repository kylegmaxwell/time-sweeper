'use strict';

class Tests {

    /**
     * Fixture data for test runs
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
            ]
        ];

        return mineFixtures[index];
    }

    run () {
        console.log('Beginning Tests');
        this._cellSize = 20;
        this.test0();
        this.test1();
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

    static expectEqual(a, b) {
        var message = 'Expected '+b+' but got '+a;
        Tests.expect(a === b, message);
    }

    static expect(statement, message) {
        message = message || 'Test failed';
        if (statement) {
            console.log('ok');
        } else {
            throw new Error(message);
        }
    }
}