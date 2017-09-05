/**
 * Some simple tests and framework 
 */

var Assertion = function (expression, errorMessage) {
    if (!expression) {
        throw errorMessage;
    }
};

var runTests = function (testSuite) {
    for (var testName in testSuite) {
        // TODO run the tests
    }
};

// TODO make the tests