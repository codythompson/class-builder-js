/**
 * Some simple tests and framework 
 */

var assert = function (expression, errorMessage) {
    if (!expression) {
        throw errorMessage;
    }
};
var assertExists = function (expression, errorMessage) {
    assert(typeof expression !== 'undefined' && expression !== null, errorMessage);
};
var assertNotExists = function (expression, errorMessage) {
    assert(typeof expression === 'undefined' || expression === null, errorMessage);
};
var assertError = function (func, errThrown, errorMessage) {
    var no_err = false;
    try {
        func();
        no_err = true;
    } catch (e) {
        assert(e === errThrown, errorMessage);
    }
    assert(no_err === false, errorMessage);
};
var assertNoError = function (func, errorMessage) {
    var no_err = true;
    var err = null;
    try {
        func();
    } catch (e) {
        no_err = false;
        err = e;
    }
    assert(no_err, errorMessage + '\n' + err);
};

var runTests = function (testSuite) {
    var results = [];
    for (var testName in testSuite) {
        var resultObj = {
            name: testName,
            errorMessage: null
        };
        var testObj = testSuite[testName];
        if (typeof testObj === 'function') {
            try {
                testObj();
            } catch (e) {
                resultObj.errorMessage = e;
            }
        } else {
            throw 'can\'t run test ' + testName;
        }
        results.push(resultObj);
    }
    return results;
};

renderResults = function (results, parentEl) {
    var contDiv = document.createElement('div');
    contDiv.className = 'test-suite-container';

    for (var i = 0; i < results.length; i ++) {
        var result = results[i];
        var resDiv = document.createElement('div');
        resDiv.className = 'test-result-container ';
        var resClass = 'passed'
        var resText = ' - passed';
        if (result.errorMessage) {
            resClass = 'failed'
            resText = ' - failed'
        }
        resDiv.className += resClass;

        var titleDiv = document.createElement('div')
        titleDiv.className = 'test-title';
        var titleSpan = document.createElement('span');
        titleSpan.innerHTML = result.name;
        var resultSpan = document.createElement('span');
        resultSpan.innerHTML = resText;
        titleDiv.appendChild(titleSpan);
        titleDiv.appendChild(resultSpan);
        resDiv.appendChild(titleDiv);

        if (result.errorMessage) {
            var messageDiv = document.createElement('div');
            messageDiv.className = 'test-message';
            messageDiv.innerHTML = result.errorMessage;
            resDiv.appendChild(messageDiv);
        }

        contDiv.appendChild(resDiv);
    }

    parentEl.appendChild(contDiv);
};

var runAndRender = function () {
    var results = runTests(testSuite);
    renderResults(results, document.body);
};

window.addEventListener('load', runAndRender);