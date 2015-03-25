module SubclassJ {
  declare class Array { }
  class SnTemp extends Array { }
  
  export let required = (() => new (<any>SnTemp)(1).length === 1)();

  export function getNewThis(thisArg: any, extending: any, arguments: any[]) {
    let newThis = new (extending.bind(null, ...arguments));

    Object.setPrototypeOf(newThis, thisArg.prototype);
    return newThis;
  }
}