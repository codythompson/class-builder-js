/**
 * TODO documentation
 */
(function (scope) {

var existsCheck = function (val) {
    return typeof val !== 'undefined' && val !== null;
};

var clone = function (obj) {
    var newObj = {};
    for (var key in obj) {
        newObj[key] = obj[key];
    }
    return newObj;
};

var setDefaults = function (valsObj, defaultsObj) {
    if (!valsObj) {
        valsObj = {};
    }

    var result = clone(valsObj);
    for (var defName in defaultsObj) {
        if (!existsCheck(valsObj[defName])) {
            result[defName] = defaultsObj[defName];
        }
    }
    return result;
};

var checkArgs = function (typeArr, argNameArr, args) {
    if (typeArr.length !== args.length) {
        throw 'expected ' + typeArr.length + ' arg(s), but got ' + args.length;
    }
    for (var i = 0; i < typeArr.length; i++) {
        var expectedType = typeArr[i];
        var gotType = typeof args[i];
        if (expectedType !== null && expectedType !== gotType) {
            throw 'expected type ' + expectedType + ' for arg ' + argNameArr[i] + ', but got arg of type ' + gotType;
        }
    }
};

// commenting this out because it feels like overkill and might introduce perf issues
// var makeMethod = function (classFunc, methodName, typeArr, argNameArr, func) {
//     return function () {
//         try {
//             checkArgs(typeArr, argNameArr, arguments);
//         } catch (e) {
//             throw '[' + classFunc.className + '][' + methodName + ']' + e;
//         }

//         return func.apply(classFunc, arguments);
//     }
// };

var ClassBuilder = {};
ClassBuilder.new = function (className) {
    try {
        checkArgs(['string'], ['className'], arguments);
    } catch (e) {
        throw '[ClassBuilder][constructor]' + e;
    }

    this.className = className;
    this.fields = [];
    this.defaults = {};
    this.required = [];
    this.init = function (args) {
        // do something with args if you need to
    };
};
ClassBuilder.field = function (fieldName) {
    try {
        checkArgs(['string'], ['fieldName'], arguments);
    } catch (e) {
        throw '[ClassBuilder][field]' + e;
    }

    this.fields.push(fieldName);
};
ClassBuilder.require = function (argName) {
    try {
        checkArgs(['string'], ['argName'], arguments);
    } catch (e) {
        throw '[ClassBuilder][require]' + e;
    }

    this.required.push(argName);
};
ClassBuilder.default = function (argName, argVal) {
    try {
        checkArgs(['string', null], ['argName', 'argVal'], arguments);
    } catch (e) {
        throw '[ClassBuilder][default]' + e;
    }

    this.defaults[argName] = argVal;
};
ClassBuilder.setInit = function (initFunc) {
    try {
        checkArgs(['function'], ['initFunc'], arguments);
    } catch (e) {
        throw '[ClassBuilder][setInit]' + e;
    }

    this.defaults[argName] = argVal;
};
ClassBuilder.build = function () {
    var className = this.className;
    var fields = this.fields;
    var required = this.required;
    var defaults = this.defaults;
    var init = this.init;
    return function (args) {
        this.className = className;

        args = setDefaults(args, defaults);
        for (var i = 0; i < required.length; i++) {
            var reqName = required[i];
            if (!existsCheck(args[reqName])) {
                throw '['+this.className+'][constructor] '+reqName+' is a required argument.';
            }
        }

        for (var i = 0; i < fields.length; i++) {
            var fieldName = fields[i];
            this[fieldName] = args[fieldName];
        }

        init(args);
    };
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassBuilder;
} else {
    scope.ClassBuilder = ClassBuilder;
}

})(this);
