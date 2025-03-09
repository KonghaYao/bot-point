import { createWriteStream, ensureDir, readJSON } from "fs-extra";
import { pipeline } from "node:stream/promises";
import { generateNpmPackageUrl } from "./generateNpmPackageUrl";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { nodeExternals } from "rollup-plugin-node-externals";
import { extractTar } from "./extractTar";
// 示例使用
const packageName = "lucide-react"; // 可以替换为任何包名，例如 "@scope/package-name"
const version = "0.479.0"; // 版本号
// onlineBuild(packageName, version);

const tempPath = (p = "") => "./output/" + p;

export async function onlineBuild(packageName: string, version: string) {
    const url = generateNpmPackageUrl(
        packageName,
        version,
        "https://registry.npmmirror.com"
    );
    console.log(url);

    // 流模式下载到本地
    const stream = await fetch(url.full).then((res) => res.body);
    await ensureDir(tempPath("/.origin/"));
    await pipeline(
        stream,
        createWriteStream(tempPath("/.origin/" + url.filename))
    );

    console.log("下载完成");
    await extractTar(
        tempPath("/.origin/" + url.filename),
        tempPath(url.folderName)
    );
    console.log("解压缩完成");
    // 开始构建
    await startBuild(url);
}
async function startBuild(url: ReturnType<typeof generateNpmPackageUrl>) {
    const pkg = await readJSON(tempPath(url.folderName + "/package.json"));
    // console.log(pkg);
    const it = pkg.module || pkg.main;
    // const p = await import("@rsbuild/plugin-react");
    const res = await rollup({
        input: tempPath(url.folderName + "/" + it), // 入口文件

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
    await ensureDir(tempPath(url.folderName + "/.output"));
    await res.write({
        dir: tempPath(url.folderName + "/.output"), // 输出目录
        format: "esm", // 输出格式：ES模块
    });
    console.log("Build completed successfully.");
}
