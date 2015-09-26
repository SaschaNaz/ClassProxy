# SubclassJ
SubclassJ is a library to help subclassing from built-in JS objects.

```javascript
class Subclass extends Promise { }
new Subclass((resolve) => resolve()).then(() => console.log("pass"));
```

This is how to subclass ES6 Promise, but this probably won't work on your browser as browsers currently do not support subclassing for built-in types. (Check [Kangax compat table](http://kangax.github.io/compat-table/es6/) and [Microsoft dev center](https://status.modern.ie/subclassinges6?term=subclassing).) SubclassJ enables this by a method suggested by [butt4cak3](http://stackoverflow.com/q/27985546/2460034).

### API

```typescript
declare module SubclassJ {
    let required: boolean;
    function getNewThis(thisArg: any, extending: any, arguments: any[]): any;
}
```

### Example

```javascript
class Subclass extends Promise {
  constructor() { 
    return SubclassJ.getNewThis(
      Subclass, Promise,
      (_a = [], _a.push.apply(_a, arguments), _a)
    );
  }
}
```

Note that your subclass powered by SubclassJ requires its own child classes again to use SubclassJ.

```javascript
class Subsubclass extends Subclass {
  constructor() { 
    return SubclassJ.getNewThis(
      Subsubclass, Subclass,
      (_a = [], _a.push.apply(_a, arguments), _a)
    );
  }
}
```

Remember that you have to define instance variables directly to your new `this` value.

```javascript
class Subsubclass extends Subclass {
  constructor() { 
    let newThis = SubclassJ.getNewThis(
      Subsubclass, Subclass,
      (_a = [], _a.push.apply(_a, arguments), _a)
    );
    
    newThis.foo = 3;
    
    return newThis;
  }
}
```
