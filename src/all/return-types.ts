export interface AutocompleteResult {
    name: string;
    count: number;
    value: string;
}

export interface SearchResult {
    nextPageExists: boolean;
    results: {
        thumbnail: string;
        preview: string;
        href: string;
        type: "static" | "animated" | "video";
        id: string | number;
        tags: { name: string; count: number; }[];
    }[];
}
