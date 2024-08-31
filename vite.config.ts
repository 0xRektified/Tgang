import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import Checker from "vite-plugin-checker";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      Checker({ typescript: true }),
      nodePolyfills(),
      ViteImageOptimizer({
        png: {
          // https://sharp.pixelplumbing.com/api-output#png
          quality: 70,
        },
      }),
      ...(mode === "production"
        ? [
            viteStaticCopy({
              targets: [
                {
                  src: "assets/**/*",
                  dest: "assets",
                },
              ],
            }),
          ]
        : []),
    ],
    base: ((process.env.GITHUB_REPOSITORY ?? "") + "/").match(/(\/.*)/)?.[1],
  };
});
