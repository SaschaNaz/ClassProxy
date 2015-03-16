module ClassProxy {
  export function create<T extends Function>(classobject: T, functionNames: { inConstructor?: string[]; inPrototype?: string[] }) {
    let constructor = <T><Function>function () {
      this._sn_inherit = new ((<any>classobject).bind.apply(classobject, [null, ...Array.from(arguments)]))();
      //new (<any>classobject)(...Array.from(arguments));
    };
    let prototype = constructor.prototype = Object.create(classobject.prototype, {
      constructor: {
        value: constructor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    (<any>constructor).__proto__ = classobject;
    
    if (functionNames.inConstructor)
      for (let functionName of functionNames.inConstructor) { // normal passthrough
        ((functionName: string) => {
          (<any>constructor)[functionName] = function () {
            return (<any>classobject)[functionName](...Array.from(arguments))
          };
        })(functionName)
      }

    if (functionNames.inPrototype)
      for (let functionName of functionNames.inPrototype) {
        ((functionName: string) => {
          (<any>prototype)[functionName] = function () { // through _sn_inherit which is an instance of T
            return this._sn_inherit[functionName](...Array.from(arguments))
          };
        })(functionName)
      }

    return constructor;
  }
}
