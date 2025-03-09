import { createWriteStream, ensureDir } from "fs-extra";
import { extractTar } from "./extractTar";
import { pipeline } from "node:stream/promises";
import { generateNpmPackageUrl } from "./generateNpmPackageUrl";
// 示例使用
const packageName = "antd"; // 可以替换为任何包名，例如 "@scope/package-name"
const version = "5.24.3"; // 版本号

const url = generateNpmPackageUrl(
    packageName,
    version,
    "https://registry.npmmirror.com"
);
console.log(url);

// // 流模式下载到本地
// const stream = await fetch(url.full).then((res) => res.body);
// await ensureDir("./dist");
// await pipeline(stream, createWriteStream("./dist/" + url.filename));

// extractTar("./dist/" + url.filename, "./dist/" + url.folderName);

import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { nodeExternals } from "rollup-plugin-node-externals";
async function startBuild() {
    // const p = await import("@rsbuild/plugin-react");
    const res = await rollup({
        input: "./dist/" + url.folderName + "/es/index.js", // 入口文件

        plugins: [
            nodeExternals(),
            nodeResolve({
                browser: true,
            }),
            // commonjs(), // 将CommonJS模块转换为ES6
            // react(), // 处理React代码
            // babel({
            //     babelHelpers: "bundled",
            //     presets: [["@babel/preset-env", { targets: "defaults" }]],
            // }),
            // replace({
            //     "process.env.NODE_ENV": JSON.stringify("production"),
            //     preventAssignment: true,
            // }),
            // terser(), // 压缩代码
        ],
    });
    await res.write({
        dir: "./output/", // 输出目录
        format: "esm", // 输出格式：ES模块
    });
    console.log("Build completed successfully.");
}

startBuild();
