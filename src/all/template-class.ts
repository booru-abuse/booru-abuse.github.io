import { getEl, createEl } from "../util/ts/dom.ts";
import { URLParameterManager } from "../util/ts/url-parameter-manager.ts";

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

    el = {
        search: {
            input: getEl<"input">("#search-bar .input"),
            clear: getEl<"button">("#search-bar .clear"),
            submit: getEl<"button">("#search-bar .submit"),
            autocomplete: getEl<"ul">("#search-bar .autocomplete")
        },
        results: getEl<"ul">("#search-results"),
        post: getEl<"article">("#post")
    };

    constructor () {
        this.bindEvents();
    }

    bindEvents() {
        // window.addEventListener("load", ...) doesnt work for some reason
        const onload = () => {
            const query = url.get("q");
            if (query !== null) {
                this.el.search.input.value = query;
                this.submitSearch(query);
            }
        };
        onload();

        window.addEventListener("error",
            e => window.alert([
                "ERROR ENCOUNTERED",
                `In ${e.filename}:${e.lineno}:${e.colno} :`,
                e.message
            ].join("\n"))
        );

        window.addEventListener("popstate", e => {
            const query = url.get("q");
            if (query) this.el.search.input.value = query;
            this.displaySearchResults(e.state);
        });

        this.el.search.input.addEventListener("input",
            () => this.suggestAutocompletion()
        );

        this.el.search.input.addEventListener("keydown",
            e => e.key === "Enter" && this.searchBarSubmit()
        );
        this.el.search.submit.addEventListener("click",
            () => this.searchBarSubmit()
        );
    }

    //#region autocomplete

    getAutocompleteWord() {
        const text = this.el.search.input.value;
        const index = this.el.search.input.selectionStart;
        if (index !== null) {
            return (
                text.substring(0, index).match( /[^ ]*$/)![0] +
                text.substring(index)   .match(/^[^ ]*/ )![0]
            );
        } else return null;
    }

    displayAutocomplete(tags) {
        switch (true) {
            case !tags:
                list.replaceChildren();
                break;
            case !tags.length:
                list.replaceChildren(
                    createEl("li", {
                        properties: { className: "no-results" },
                        children: [ "No results!" ]
                    })
                );
                break;
            default:
                list.replaceChildren(...tags.map(tag =>
                    createEl("li", { children: [
                        createEl("span", {
                            properties: { className: "name" },
                            children: [ tag.name ]
                        }),
                        createEl("span", {
                            properties: { className: "count" },
                            children: [ tag.count ]
                        })
                    ]})
                ));
        }
    }

    async suggestAutocompletion() {
        const tag = this.getAutocompleteWord();
        if (!tag) {
            this.displayAutocomplete(null);
            return;
        } else {
            const results = await this.autocomplete(tag);
            this.displayAutocomplete(results);
        }
    }

    //#region search

    displaySearchResults(posts) {
        const list = this.el.results;
        switch (true) {
            case !posts:
                list.replaceChildren();
                break;
            case !posts.length:
                list.replaceChildren(
                    createEl("li", {
                        properties: { className: "no-results" },
                        children: [ "No results!" ]
                    })
                );
                break;
            default:
                list.replaceChildren(...posts.map(post =>
                    createEl("li", {
                        properties: {
                            className: post.type,
                            title: `${post.id}: ${post.tags
                                .map(t => `${t.name} (${t.count})`)
                                .join(", ")
                            }`
                        },
                        children: [ createEl("a", {
                            properties: { href: post.href },
                            children: [
                                createEl("img", { properties: {
                                    className: "thumb",
                                    src: post.thumbnail
                                }}),
                                createEl("img", { properties: {
                                    className: "preview",
                                    src: post.preview
                                }})
                            ]
                        })]
                    })
                ));
        }
    }

    async submitSearch(query) {
        this.displaySearchResults(null);
        const results = await this.search(query);
        url.set({ q: query }, results);
        this.displaySearchResults(results);
    }

    searchBarSubmit() {
        const query = this.el.search.input.value;
        this.submitSearch(query);
    }
}
