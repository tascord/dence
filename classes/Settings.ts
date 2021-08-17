const defaults = {

    "poweredBy": true,

}

class Settings {
    
    values: typeof defaults;

    constructor() {
        this.values = defaults;
    }

    set(key: keyof typeof defaults, value: any): Settings {

        if(!this.values[key]) throw new TypeError(`No value '${key}' exists in settings`);
        this.values[key] = value;
        return this;
    }

    get(key: keyof typeof defaults): any {
        return this.values[key] ?? null;
    }

}

export default Settings;