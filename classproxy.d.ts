declare module ClassProxy {
    function create<T extends Function>(classobject: T): T;
}
