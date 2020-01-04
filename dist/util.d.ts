declare const tryGetHttpResponseError: (err: any) => {
    data: any;
    statusText: any;
};
declare const removeStackProperty: (obj: any) => any;
declare const cleanErrorResponse: (err: any) => {
    data: any;
    statusText: any;
};
declare const sendErrorResponse: (res: any, err: any) => any;
declare const getRandomUniqueNumbers: (length: number, maxRandomNumbers: number) => any;
export { sendErrorResponse, removeStackProperty, cleanErrorResponse, tryGetHttpResponseError, getRandomUniqueNumbers };
//# sourceMappingURL=util.d.ts.map