'use strict';

class Tests {

    /**
     * Fixture data for test runs
     */
    static getTest(index) {

        var mineFixtures = [
            [[0, 0, 0, 1, 0],
             [1, 1, 0, 0, 0],
             [0, 0, 1, 0, 0],
             [0, 0, 0, 0, 0]]
        ];

        return mineFixtures[index];
    }

    run () {
        console.log('Beginning Tests');
        var cellSize = 20;

        var mines = Tests.getTest(0);
        var board = new Board(mines.length, mines[0].length, mines, cellSize);
        Tests.expect(board.gameIsOver() === false);
        Tests.expectEqual(board._numRows, 4);
        Tests.expectEqual(board._numCols, 5);
        Tests.expectEqual(board._grid[0][3].isMined(), true);

        // Check that explore propagates but not too far.
        board.doExplore(board._margin+4*cellSize+1, board._margin+3*cellSize+1);
        Tests.expectEqual(board._grid[3][4].isClicked(), true);
        Tests.expectEqual(board._grid[2][4].isClicked(), true);
        Tests.expectEqual(board._grid[3][3].isClicked(), true);
        Tests.expectEqual(board._grid[3][2].isClicked(), false);
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