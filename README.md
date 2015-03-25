# SubclassJ
SubclassJ is a library to help subclassing from built-in JS objects.

```javascript
class Subclass extends Promise { }
new Subclass((resolve) => resolve()).then(() => console.log("pass"));
```

This is how to subclass ES6 Promise, but this probably won't work on your brower even when you use ES6 transpilers. That's because browsers currently do not support subclassing for built-in types. (Check [here](http://kangax.github.io/compat-table/es6/) and [here](https://status.modern.ie/subclassinges6?term=subclassing).) ClassProxy enables this by some magic, provided by [butt4cak3](http://stackoverflow.com/q/27985546/2460034).

### API

```typescript
declare module SubclassJ {
    let required: boolean;
    function getNewThis(thisArg: any, extending: any, arguments: IArguments): any;
}
```

### Example

```javascript
class Subclass extends Promise { constructor() { return SubclassJ.getNewThis(Subclass, Promise, arguments) } }
```
