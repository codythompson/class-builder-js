
// TODO
// test what happens when the field, default, and required functions aren't called correctly
// test what happens when you set classBuilder.fields, .defaults, or .required explicitly
// maybe test a bunch of different types passed into args
var testSuite = {
    "ClassBuilder field function": function () {
        var cb = ClassBuilder;
        cb.new('C');
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
        var cb = ClassBuilder;
        cb.new('C');
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
        assertExists(c.test2, 'field test3 not defined');
        assertExists(c.test3, 'field test3 not defined');
    },
    "ClassBuilder required function": function () {
        var cb = ClassBuilder;
        cb.new('C');
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
    },
    "ClassBuilder init scope": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.init = function (args) {
            assert(this.test1 === 'woot', 'Expected test1 to be "woot" instead got ' + this.test1);;
        }
        var C = cb.build();
        c = new C();
    },
    "ClassBuilder init scope using setInit": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.setInit(function (args) {
            assert(this.test1 === 'woot', 'Expected test1 to be "woot" instead got ' + this.test1);;
        });
        var C = cb.build();
        c = new C();
    },
    "ClassBuilder access prototype from init": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.setInit(function (args) {
            assert(typeof this.testFunc === 'function', 'Expected testFunc be a function but instead is ' + typeof this.testFunc);;
        });
        var C = cb.build();
        C.prototype.testFunc = function () {};
        c = new C();
    },

    /*
     * The following mirror the tests above,
     * but test for the case where used with
     * an existing object
     */
    "ClassBuilder field function with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.field('test2');
        cb.field('test3');
        var init = cb.build();

        var C = function (args) {
            init.call(this, args)
        };
        var c = new C({
            test1: true,
            test2: true,
            test3: true
        });

        assert(c.test1, 'field test1 not defined');
        assert(c.test2, 'field test2 not defined');
        assert(c.test3, 'field test3 not defined');
    },

    "ClassBuilder default function with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.default('test1', true);
        cb.default('test3', false);
        cb.field('test2');
        cb.field('test3');
        var init = cb.build();

        var C = function (args) {
            init.call(this, args)
        };
        var c = new C({
            test2: true,
            test3: true,
        });

        assertNotExists(c.test1, 'field test1 should not exist');
        assertExists(c.test2, 'field test3 not defined');
        assertExists(c.test3, 'field test3 not defined');
    },
    "ClassBuilder required function with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.default('test1', 0);
        cb.require('test1');
        cb.require('test2');
        cb.require('test3');
        var init = cb.build();

        var C = function (args) {
            init.call(this, args)
        };

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
    },
    "ClassBuilder init scope with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.init = function (args) {
            assert(this.test1 === 'woot', 'Expected test1 to be "woot" instead got ' + this.test1);;
        };
        var init = cb.build();

        var C = function (args) {
            init.call(this, args);
        };
        var C = cb.build();
        c = new C();
    },
    "ClassBuilder init scope using setInit with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.setInit(function (args) {
            assert(this.test1 === 'woot', 'Expected test1 to be "woot" instead got ' + this.test1);;
        });
        var init = cb.build();

        var C = function (args) {
            init.call(this, args);
        };

        c = new C();
    },
    "ClassBuilder access prototype from init with existing class": function () {
        var cb = ClassBuilder;
        cb.new('C');
        cb.field('test1');
        cb.default('test1', 'woot');
        cb.setInit(function (args) {
            assert(typeof this.testFunc === 'function', 'Expected testFunc be a function but instead is ' + typeof this.testFunc);;
        });
        var init = cb.build();
        var C = function (args) {
            init.call(this, args);
        };
        C.prototype.testFunc = function () {};
        c = new C();
    },
};