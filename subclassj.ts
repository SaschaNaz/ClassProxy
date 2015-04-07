module SubclassJ {
  module _Temp {
    declare class Array { }
    export class SnTemp extends Array { }
  }
  _Temp.SnTemp = Array;
  
  export let required = (() => new (<any>_Temp.SnTemp)(1).length === 1)();

  export function getNewThis(thisArg: any, extending: any, arguments: IArguments | any[]) {
    let newThis = new (extending.bind(null, ...(Array.isArray(arguments) ? arguments : Array.prototype.map.call(arguments, (v: any) => v))));

    Object.setPrototypeOf(newThis, thisArg.prototype);
    return newThis;
  }
}

interface Window {
  SubclassJ: typeof SubclassJ;
}