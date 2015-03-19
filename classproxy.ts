module ClassProxy {
  function proxifyParentProto(proto: any, newChildProto: any) {
    return new Proxy(
      proto, {
        get(target: any, property: string) {
          if (property === "__proto__")
            return newChildProto;
          return newChildProto[property];
        }
      });
  }
  function retargetProto(proto: any, instance: any, internalInstanceName: string) {
    return new Proxy(
      proto, {
        get(target: any, property: string) {
          let retargeted = instance[internalInstanceName] || instance;

          // non-function property
          if (typeof target[property] !== "function")
            return (instance[internalInstanceName] || instance)[property];

          // function property
          if (property in retargeted)
            return function () { return retargeted[property](...Array.from(arguments)) };
          else
            return target[property]; // for when the proxy directly got some functions as a prototype
        },
        set(target: any, property: string, value: any, receiver: any) {
          let retargeted = instance[internalInstanceName] || instance;
          retargeted[property] = value;
          return retargeted[property] === value;
        }
      });
  }
  function lookupProtoChain(instance: any, prototype: any) {
    let parent = instance;
    let chain: any[] = [];

    while (true) {
      if (!parent.__proto__)
        return null;
      if (parent.__proto__ === prototype)
        return chain;
      parent = parent.__proto__;
      chain.push(parent);
    }
  }
  function proxifyProtoChain(instance: any, prototype: any) {
    // Proxify parent protos so that they can access proxified target prototype
    // without affecting other normal instances
    let internalInstanceName = prototype._sn_inherit_key();

    let chain = lookupProtoChain(instance, prototype).reverse();
    let child = retargetProto(prototype, instance, internalInstanceName);
    for (let proto of chain) {
      child = proxifyParentProto(proto, child);
    }
    return child;
  }
  export function create<T extends Function>(classobject: T) {
    let internalInstanceName = "_sn_inherit_" + btoa(`${Math.random()}`);
    let constructor = <T><Function>function () {
      this[internalInstanceName] = new ((<any>classobject).bind.apply(classobject, [null, ...Array.from(arguments)]))();
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
    prototype._sn_inherit_key = () => internalInstanceName;
    (<any>constructor).__proto__ = classobject;

    return new Proxy(
      constructor, {
        construct(target: any, arguments: any[]) {
          let instance = new (target.bind.apply(target, [null, ...arguments]));
          instance.__proto__ = proxifyProtoChain(instance, prototype);
          return instance;
        },
        apply(target, thisArg, arguments) {
          thisArg.__proto__ = proxifyProtoChain(thisArg, prototype);
          return target.apply(thisArg, arguments);
        }
      });
  }
}
