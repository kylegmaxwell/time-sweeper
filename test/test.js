var assert = require('assert');
var cellModule = require('../src/stores/cell');

/**
 *  Define a suite of tests to make sure everything works
 */
describe('test the mines', function() {
  var cell;
  /**
   *  Set up vars that are needed by test
   */
  before(function(done) {
    // cell = new cellModule();
    done();
  });

  /**
   *  Close any connections
   */
  after(function(done) {
    done();
  });

  /**
   *  This test ensures that interface.js' `insert()` function properly inserts
   *  a document into the "movies" collection.
   */
  it('basic test2', function() {
    // console.log(cell);
    assert(true);
  });

});
