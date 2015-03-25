var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SubclassJ;
(function (SubclassJ) {
    var SnTemp = (function (_super) {
        __extends(SnTemp, _super);
        function SnTemp() {
            _super.apply(this, arguments);
        }
        return SnTemp;
    })(Array);
    SubclassJ.required = function () {
        return new SnTemp(1).length === 1;
    };
    function getNewThis(thisArg, extending, arguments) {
        var newThis = new (extending.bind.apply(extending, [null].concat(arguments)));
        Object.setPrototypeOf(newThis, thisArg.prototype);
        return newThis;
    }
    SubclassJ.getNewThis = getNewThis;
})(SubclassJ || (SubclassJ = {}));
//# sourceMappingURL=subclassj.js.map