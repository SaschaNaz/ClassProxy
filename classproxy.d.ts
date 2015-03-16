declare module ClassProxy {
    function create<T extends Function>(classobject: T, functionNames: {
        inConstructor?: string[];
        inPrototype?: string[];
    }): T;
}
