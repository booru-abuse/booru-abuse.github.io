// //@ts-ignore TS6059
// import * as Boorujs from "../../../booru.js/src/index.ts"; // for debugging
//@ts-expect-error TS2307
import * as Boorujs from "https://esm.sh/gh/boorujs/booru.js@f1b1ba6/src/index.ts.mjs?target=es2022";
import { Submodule } from "../all/template-class.ts";

const { Rule34 } = Boorujs;

window.eval(`/*

this page is in testing and i just want to be sure esm.sh works before i get
custom api keys or a vercel service set up

i dont value an individual limited key enough to hide it in any way, ill
refresh the key for the account once i get custom keys set up #lol

regardless dont abuse the given key please and thanks!

*/`);

const auth = {
    api_key: "57931764243134609eb715b9d5c931134cb3cadfdbe166548b2b25543b869f82ee435076819810388fac48119b1eb0731dc86d75aff7b163e5d0c01f21618ecb",
    user_id: 5894621
};

const client = new Rule34.Client({ auth: auth });

try {
    await client.test();
} catch (error: any) {
    window.alert([
        [
            "Uh-oh! The API key doesn't work properly. Please let me know via",
            "an issue and I'll be sure to fix it as soon as I can. Below are",
            "the specific error details."
        ].join(" "),
        error.toString()
    ].join("\n"));
    window.stop();
}

new class Rule34Module extends Submodule {
    async autocomplete(query: string) {
        return await client.autocomplete(query)
        .then((tags: any) => tags.map((tag: any) => ({
            name: tag.name.replace(/_/g, " "),
            count: tag.count,
            value: tag.name
        })));
    }

    async search(query: string, page: number) {
        return await client.search(query, {
            page: page,
            perPage: 42
        }).then((search: any) => search.results.map((post: any) => ({
            thumbnail: post.file.preview.url,
            preview: post.file.type === Boorujs.MediaType.Video
                ? post.file.sample.url
                : post.file.url,
            href: post.file.url + "?" + post.id,
            type: ({
                [Boorujs.MediaType.Static]: "static",
                [Boorujs.MediaType.Animated]: "animated",
                [Boorujs.MediaType.Video]: "video",
            } as any)[post.file.type],
            id: post.id,
            tags: post.tags.artist.map(
                (tag: any) => ({ name: tag.name, count: tag.count })
            )
        })));
    }
}
