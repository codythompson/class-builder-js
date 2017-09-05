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

/*
 * begin test suite
 */
var testSuite = {
    "ClassBuilder field function": function () {
        var cb = new ClassBuilder('C');
        cb.field('test1');
        cb.field('test2');
        cb.field('test3');

        var C = cb.build();
        var c = new C({
            test1: true,
            test2: true,
            test3: true
        });

        assert(c.test1, 'field test1 not defined');
        assert(c.test2, 'field test2 not defined');
        assert(c.test3, 'field test3 not defined');
    },

    "ClassBuilder default function": function () {
        var cb = new ClassBuilder('C');
        cb.default('test1', true);
        cb.default('test3', false);
        cb.field('test2');
        cb.field('test3');

        var C = cb.build();
        var c = new C({
            test2: true,
            test3: true,
        });

        assertNotExists(c.test1, 'field test1 should not exist');
        assert(c.test3, 'field test3 not defined');
    }
};
/*
 * end test suite
 */

var runAndRender = function () {
    var results = runTests(testSuite);
    renderResults(results, document.body);
};

window.addEventListener('load', runAndRender);