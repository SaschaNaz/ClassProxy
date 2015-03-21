var ClassProxy;
(function (ClassProxy) {
    function proxifyParentProto(proto, newChildProto) {
        var proxied = new Proxy(proto, {
            get: function (target, property, receiver) {
                if (property === "__proto__")
                    return newChildProto;
                if (target.hasOwnProperty(property))
                    return target[property];
                else
                    return newChildProto[property];
            }
        });
        return proxied;
    }
    function retargetProto(proto, instance, internalInstanceName) {
        return new Proxy(proto, {
            get: function (target, property) {
                var retargeted = instance[internalInstanceName] || instance;
                if (property in retargeted) {
                    if (typeof target[property] !== "function")
                        return (instance[internalInstanceName] || instance)[property];
                    else
                        return function () {
                            return retargeted[property].apply(retargeted, Array.from(arguments));
                        };
                }
                else
                    return target[property]; // for when the proxy directly got some functions as a prototype
            },
            set: function (target, property, value, receiver) {
                var retargeted = instance[internalInstanceName] || instance;
                retargeted[property] = value;
                return retargeted[property] === value;
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
    }
    ClassProxy.create = create;
})(ClassProxy || (ClassProxy = {}));
//# sourceMappingURL=classproxy.js.map