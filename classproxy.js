var ClassProxy;
(function (ClassProxy) {
    function create(classobject) {
        var constructor = function () {
            this._sn_inherit = new (classobject.bind.apply(classobject, [null].concat(Array.from(arguments))))();
            //new (<any>classobject)(...Array.from(arguments));
        };
        constructor.prototype = new Proxy(Object.create(classobject.prototype, {
            constructor: {
                value: constructor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        }), {
            get: function (target, property) {
                if (typeof target[property] !== "function")
                    return target[property];
                return function () {
                    (_a = this._sn_inherit)[property].apply(_a, Array.from(arguments));
                    var _a;
                };
            }
        });
        constructor.__proto__ = classobject;
        return constructor;
    }
    ClassProxy.create = create;
})(ClassProxy || (ClassProxy = {}));
//# sourceMappingURL=classproxy.js.map