# class-builder-js

A tool for making javascript classes. It assumes that you'll always be passing a single, js object (AKA key value store, dictionary), into the constructor. We'll refer to this object as the 'args' object within this doc.

## usage

1. To start, call ClassBuilder.new with your class name

```javascript
ClassBuilder.new('MyAwesomeClass');
```

2. To create your constructor function, simply call ClassBuilder.build();

```javascript
ClassBuilder.new('MyAwesomeClass');

// returns a constructor function AKA a class
var MyAwesomeClass = ClassBuilder.build();
```

3. Set some fields using the field function. When you set a field, ClassBuilder will look at the args object passed into the constructor, and set fields (aka instance variables) on your object with values found in the args object.

```javascript
ClassBuilder.new('MyAwesomeClass');

// will add a field called 'my_field' to the class
ClassBuilder.field('my_field');

var MyAwesomeClass = ClassBuilder.build();

var myAwesomeInstance = new MyAwesomeClass({
    some_val: 'blah',
    my_field: 'rad',
});
console.log(myAwesomeInstance.my_field); // should print 'rad'
```

4. To define your constructor, simply set ClassBuilder.init.

```javascript
ClassBuilder.new('MyAwesomeClass');
ClassBuilder.field('my_field');

// will be called everytime somebody makes a new instance of your class.
// will be passed the args object
ClassBuilder.init = function (args) {
    console.log(args.some_val);
};

var MyAwesomeClass = ClassBuilder.build();

var myAwesomeInstance = new MyAwesomeClass({
    some_val: 'blah',
    my_field: 'rad',
}); // prints out 'blah'
```

5. You can even set default values using the default function.

```javascript
ClassBuilder.new('MyAwesomeClass');
ClassBuilder.field('my_field');

// will set args.some_val equal to 'defaults_rule' unless 'some_val' already
// exists in the args object
ClassBuilder.default('some_val', 'defaults_rule');

ClassBuilder.init = function (args) {
    console.log(args.some_val);
};
var MyAwesomeClass = ClassBuilder.build();

var myAwesomeInstance = new MyAwesomeClass({
    my_field: 'rad',
}); // prints out 'defaults_rule'
var myOtherInstance = new MyAwesomeClass({
    my_field: 'rad',
    some_val: 'tubular',
}); // prints out 'tubular'
```

6. Want to insist that certain values be provided? You can do that too with the require function.

```javascript
ClassBuilder.new('MyAwesomeClass');
ClassBuilder.field('my_field');
ClassBuilder.default('some_val', 'defaults_rule');

// will make it so an error is thrown if 'my_field' isn't a key on the args
// object
ClassBuilder.require('my_field');

ClassBuilder.init = function (args) {
    console.log(args.some_val);
};
var MyAwesomeClass = ClassBuilder.build();

var myAwesomeInstance = new MyAwesomeClass({
    some_val: 'whaaat',
}); // throws an error!
var myOtherInstance = new MyAwesomeClass({
    my_field: 'gettin right with my interpreter',
}); // doesn't throw an error!
```
