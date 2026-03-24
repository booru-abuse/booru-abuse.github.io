import { getEl, createEl } from "../util/ts/dom.ts";
import { URLParameterManager } from "../util/ts/url-parameter-manager.ts";

type ElementList = { [K: keyof any]: HTMLElement | ElementList };

const url = new URLParameterManager();

export abstract class Submodule {
    /** Method run when autocompletion is searched for. */
    abstract autocomplete(query: string): Promise<{
        name: string;
        count: number;
        value: string;
    }[]>;
    
    /** Method run when post results are searched for. */
    abstract search(query: string): Promise<{
        thumbnail: string;
        preview: string;
        href: string;
        type: "static" | "animated" | "video";
        id: string | number;
        tags: { name: string; count: number; }[];
    }[]>;

    el!: ElementList;

    constructor () {
        this.setElements();
    }

    setElements() {
        this.el = {
            search: {
                input: getEl<"input">("#search-bar .input"),
                clear: getEl<"button">("#search-bar .clear"),
                submit: getEl<"button">("#search-bar .submit"),
                autocomplete: getEl<"ul">("#search-bar .autocomplete")
            },
            searchResults: getEl<"ul">("#search-results")
        };
    }

    getAutocompleteWord() {
    }

    async suggestAutocompletion() {

        const results = await this.autocomplete();
    }
}
