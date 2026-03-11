import { defineConfig } from "vite";
import { glob } from "glob";

export default defineConfig({
    build: {
        emptyOutDir: true,
        assetsInlineLimit: 0,
        sourcemap: true,
        rollupOptions: {
            input: [
                ...glob.sync("src/**/*.html")
            ]
        }
    },
    css: {
        devSourcemap: true
    },
    plugins: [
        {
            name: "remove-src-dir-from-path",
            enforce: "post",
            generateBundle(_, bundle) {
                const regex = /^src\//;
                for (const item of Object.values(bundle)) {
                    if (!regex.test(item.fileName)) continue;
                    item.fileName = item.fileName.replace(regex, "");
                }
            }
        }
    ]
});
