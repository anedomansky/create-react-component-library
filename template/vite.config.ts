import { defineConfig } from "vite";
import { extname, relative, resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { globSync } from "glob";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ["lib"] }), libInjectCss()],
  build: {
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-jsx-runtime"],
      input: Object.fromEntries(
        globSync("lib/**/*.{ts,tsx}", {
          ignore: ["lib/**/*.d.ts", "lib/**/*.spec.ts"],
        }).map((file) => [
          // This removes `lib/` and the file extension from each file:
          // e.g. lib/nested/foo.ts becomes nested/foo"preinstall": "npx only-allow pnpm",
          relative("lib", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          // e.g. lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].mjs",
        format: "es",
      },
    },
  },
});
