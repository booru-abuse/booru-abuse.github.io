export class DOMManager {
    /**
     * @param {string} id 
     * @param {string | undefined} query 
     * @returns {HTMLElement}
     */
    getElement(id, query) {
        const el = document.getElementById(id);
        if (query) return el.querySelector(query);
        else return el;
    }
}
