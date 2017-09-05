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
    },
    "ClassBuilder required function": function () {
        var cb = new ClassBuilder('C');
        cb.default('test1', 0);
        cb.require('test1');
        cb.require('test2');
        cb.require('test3');

        var C = cb.build();

        var funcA = function () {
            var c = new C({
                test2: '',
                test3: 0
            });
        };
        assertNoError(funcA, 'No error should be thrown, all required args provided.');

        var funcB = function () {
            var c = new C({
                test2: ''
            });
        };
        var expErr = '[C][constructor] test3 is a required argument.';
        assertError(funcB, expErr, 'Expceted the constructor to throw ' + expErr);
    }

    // TODO
    // test what happens when the field, default, and required functions aren't called correctly
    // test what happens when you set classBuilder.fields, .defaults, or .required explicitly
    // maybe test a bunch of different types passed into args
};
/*
 * end test suite
 */

var runAndRender = function () {
    var results = runTests(testSuite);
    renderResults(results, document.body);
};

window.addEventListener('load', runAndRender);