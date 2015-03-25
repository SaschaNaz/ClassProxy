declare module SubclassJ {
    let required: () => boolean;
    function getNewThis(thisArg: any, extending: any, arguments: any[]): any;
}
