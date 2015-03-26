declare module SubclassJ {
    let required: boolean;
    function getNewThis<T extends Function>(thisArg: T, extending: any, arguments: IArguments | any[]): T;
}
