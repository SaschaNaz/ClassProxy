module ClassProxy {
  export function create<T extends Function>(classobject: T) {
    let constructor = <T><Function>function () {
      this._sn_inherit = new ((<any>classobject).bind.apply(classobject, [null, ...Array.from(arguments)]))();
      //new (<any>classobject)(...Array.from(arguments));
    };
    constructor.prototype = new Proxy(
      Object.create(classobject.prototype, {
        constructor: {
          value: constructor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      }), {
        get(target: any, property: string) {
          if (typeof target[property] !== "function")
            return target[property];
          return function () {
            this._sn_inherit[property](...Array.from(arguments))
          }
        }
      });
    (<any>constructor).__proto__ = classobject;

    return constructor;
  }
}
