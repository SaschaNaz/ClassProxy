var ClassProxy;
(function (ClassProxy) {
    function create(classobject, functionNames) {
        var constructor = function () {
            this._sn_inherit = new (classobject.bind.apply(classobject, [null].concat(Array.from(arguments))))();
        };
        var prototype = constructor.prototype = Object.create(classobject.prototype, {
            constructor: {
                value: constructor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        constructor.__proto__ = classobject;
        if (functionNames.inConstructor)
            for (var _i = 0, _a = functionNames.inConstructor; _i < _a.length; _i++) {
                var functionName = _a[_i];
                (function (functionName) {
                    constructor[functionName] = function () {
                        return (_b = classobject)[functionName].apply(_b, Array.from(arguments));
                        var _b;
                    };
                })(functionName);
            }
        if (functionNames.inPrototype)
            for (var _b = 0, _c = functionNames.inPrototype; _b < _c.length; _b++) {
                var _functionName = _c[_b];
                (function (functionName) {
                    prototype[functionName] = function () {
                        return (_d = this._sn_inherit)[functionName].apply(_d, Array.from(arguments));
                        var _d;
                    };
                })(_functionName);
            }
        return constructor;
    }
    ClassProxy.create = create;
})(ClassProxy || (ClassProxy = {}));
//# sourceMappingURL=classproxy.js.map