import { defineConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import fse from "fs-extra";
import autoprefixer from "autoprefixer";

const COMPILE_TARGETS = ["last 2 versions", "IE 10", "Chrome 63"]; // chrome 63 解决 globalThis 问题

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const IS_DEV = command === "serve";
  const PROJECT_ENV = process.env.PROJECT_ENV || "online";
  const ROUTE_BASE = `/v`;
  const PUBLIC_PATH = IS_DEV
    ? "/"
    : ((): string => {
        const configPath = path.join(__dirname, "./.temp/__project__.json");

        if (!fse.pathExistsSync(configPath)) {
          return "/";
        }

        const config = fse.readJSONSync(configPath);

        return config.public_path;
      })();

  return {
    // base: "/",
    base: "/poker/",
    // base: "/v",
    // base: "./",
    define: {
      __PROJECT__: JSON.stringify({
        IS_DEV,
        ENV: PROJECT_ENV,
        ROUTE_BASE,
        PUBLIC_PATH,
      }),
    },
    build: {
      // outDir: `.temp/v`,
      outDir: `.temp`,
      target: "es2015",
      minify: "terser", // 必须配置'terser'，不然terserOptions不生效，因为minify默认不是'terser'
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
    esbuild: {
      target: "es2020", // 改为 es2015 可以在 IOS13 中看兼容性问题，但无法热更新
    },
    plugins: [
      react({}),
      vitePluginImp({
        optimize: true,
        libList: [
          {
            libName: "fnx-ui",
            style: (name) => `fnx-ui/es/${name}/style/css.js`,
          },
          {
            libName: "antd",
            style: () => false, // 改为全量引入，低版本浏览器方可同级覆盖antd样式
          },
        ],
      }),
      legacy({
        targets: COMPILE_TARGETS,
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        modernPolyfills: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: COMPILE_TARGETS,
          }),
        ],
      },
    },
    server: {
      port: 3001,
      host: "0.0.0.0",
      fs: {
        strict: false,
      },
      proxy: {
        "^/backend-api/*": {
          // target: "http://api-htdocs.beta1.fn:7400/mock/51",
          target: "http://8.134.97.109:8003",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend-api/, "/"),
        },
      },
    },
  };
});
