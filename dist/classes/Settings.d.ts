declare const defaults: {
    poweredBy: boolean;
    disallowMultipleHandlers: boolean;
};
declare class Settings {
    values: typeof defaults;
    constructor();
    set(key: keyof typeof defaults, value: any): Settings;
    get(key: keyof typeof defaults): any;
}
export default Settings;
