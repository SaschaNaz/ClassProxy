var ClassProxy;
(function (ClassProxy) {
    function proxifyParentProto(proto, newChildProto) {
        return new Proxy(proto, {
            get: function (target, property) {
                if (property === "__proto__")
                    return newChildProto;
                return target[property];
            }
        });
    }
    function retargetProto(proto, instance, internalInstanceName) {
        return new Proxy(proto, {
            get: function (target, property) {
                if (typeof target[property] !== "function")
                    return (instance[internalInstanceName] || instance)[property];
                return function () {
                    return (_a = (instance[internalInstanceName] || instance))[property].apply(_a, Array.from(arguments));
                    var _a;
                };
            }
        });
    }
    function lookupProtoChain(instance, prototype) {
        var _parent = instance;
        var chain = [];
        while (true) {
            if (!_parent.__proto__)
                return null;
            if (_parent.__proto__ === prototype)
                return chain;
            _parent = _parent.__proto__;
            chain.push(_parent);
        }
    }
    function proxifyProtoChain(instance, prototype) {
        // Proxify parent protos so that they can access proxified target prototype
        // without affecting other normal instances
        var internalInstanceName = prototype._sn_inherit_key();
        var chain = lookupProtoChain(instance, prototype).reverse();
        var child = retargetProto(prototype, instance, internalInstanceName);
        for (var _i = 0; _i < chain.length; _i++) {
            var proto = chain[_i];
            child = proxifyParentProto(proto, child);
        }
        return child;
    }
    //function insertProtoProxy(instance: any, prototype: any) {
    //  let parent = findProto(instance, prototype);
    //  parent.__proto__ = new Proxy(
    //    prototype,
    //    {
    //      get(target: any, property: string) {
    //        if (typeof target[property] !== "function")
    //          return (this._sn_inherit || target)[property];
    //        return function () {
    //          return (this._sn_inherit || target)[property](...Array.from(arguments))
    //        }
    //      }
    //    });
    //  return instance;
    //}
    function create(classobject) {
        var internalInstanceName = "_sn_inherit_" + btoa("" + Math.random());
        var constructor = function () {
            this[internalInstanceName] = new (classobject.bind.apply(classobject, [null].concat(Array.from(arguments))))();
            //new (<any>classobject)(...Array.from(arguments));
        };
        var prototype = constructor.prototype = Object.create(classobject.prototype, {
            constructor: {
                value: constructor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        prototype._sn_inherit_key = function () {
            return internalInstanceName;
        };
        constructor.__proto__ = classobject;
        return new Proxy(constructor, {
            construct: function (target, arguments) {
                var instance = new (target.bind.apply(target, [null].concat(arguments)));
                instance.__proto__ = proxifyProtoChain(instance, prototype);
                return instance;
            },
            apply: function (target, thisArg, arguments) {
                thisArg.__proto__ = proxifyProtoChain(thisArg, prototype);
                return target.apply(thisArg, arguments);
            }
        });
        // TODO: Allow `class subclass extends ClassProxy.create(Array) {} new subclass(1,2,3).length`
    }
    ClassProxy.create = create;
})(ClassProxy || (ClassProxy = {}));
//# sourceMappingURL=classproxy.js.map