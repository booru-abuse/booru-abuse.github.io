export class URLParameterManager {
    set(object) {
        const params = new URLSearchParams();
        Object.entries(object).forEach(
            ([ key, value ]) => params.set(key, value)
        );
        this.setParams(params);
    }

    replace(object) {
        const params = this.getParams();
        Object.entries(object).forEach(
            ([ key, value ]) => params.set(key, value)
        );
        this.setParams(params);
    }

    remove(...keys) {
        const params = this.getParams();
        keys.forEach(params.delete);
        this.setParams(params);
    }

    getParams() {
        return new URL(window.location.href).searchParams;
    }

    setParams(params) {
        const url = new URL(window.location);
        url.search = params.toString();
        window.history.pushState({}, "", url.href);
    }
};
