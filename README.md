# ClassProxy
ClassProxy is a library to help subclassing from built-in JS objects.

```javascript
class Subclass extends Promise { }
new Subclass((resolve) => resolve()).then(() => console.log("pass"));
```

This is how to subclass ES6 Promise, but this probably won't work on your brower even when you use ES6 transpilers. That's because browsers currently do not support subclassing for built-in types. (Check [here](http://kangax.github.io/compat-table/es6/) and [here](https://status.modern.ie/subclassinges6?term=subclassing).) ClassProxy enables this by some magic.

### API

```typescript
declare module ClassProxy {
    function create<T extends Function>(classobject: T): T;
}
```

### Example

```javascript
let proxied = ClassProxy.create(Promise);
class Subclass extends proxied { }
```

Or, more simply:

```javascript
class Subclass extends (ClassProxy.create(Promise)) { }
```
