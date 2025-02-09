import fs from "fs-extra";
import ts from "typescript";
import path from "path";
import glob from "fast-glob";

const getBasePath = () => {
    return path.resolve("./").replace("Users", "users");
};

export function main({
    sourcePath = "./server/routes/**/*.ts",
    targetPath = "./dist/",
    prefix = "",
}: {
    sourcePath?: string;
    targetPath?: string;
    // 写在文件头部的导入
    prefix?: string;
} = {}) {
    const program = createProgramWithConfig("./tsconfig.json", []);
    const checker = program.getTypeChecker();
    return glob(sourcePath, { absolute: true }).then((files) => {
        const codeParts = files
            .map((input) => {
                return genServerEndPointType(
                    program.getSourceFile(input),
                    checker
                );
            })
            .reduce(
                (col, cur) => {
                    col.dts += (cur.dts ?? "") + "\n";
                    col.fetch += (cur.fetch ?? "") + "\n";
                    return col;
                },
                { dts: "", fetch: "" }
            );

        fs.outputFileSync(
            path.resolve(getBasePath(), targetPath + "api-type.d.ts"),
            `${prefix}
${codeParts.dts}
`
        );
        fs.outputFileSync(
            path.resolve(getBasePath(), targetPath + "fetch.ts"),
            `${prefix}
            export default {
${codeParts.fetch}
}`
        );
    });
}

function createProgramWithConfig(configFilePath, fileNames) {
    // 读取并解析 tsconfig.json 文件
    const configParseResult = ts.readConfigFile(
        configFilePath,
        ts.sys.readFile
    );

    if (configParseResult.error) {
        console.error(
            ts.formatDiagnostic(
                configParseResult.error,
                ts.createCompilerHost({})
            )
        );
        return;
    }

    // 解析配置信息，获取编译选项和文件列表
    const configParseHost = {
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        useCaseSensitiveFileNames: false,
        getCurrentDirectory: () => getBasePath(),
        getDirectories: (directoryName) => ts.sys.getDirectories(directoryName),
    };

    const parsedConfig = ts.parseJsonConfigFileContent(
        configParseResult.config,
        configParseHost,
        getBasePath()
    );

    // 如果你有额外的文件需要加入编译，可以在这里添加
    const allFileNames = fileNames.concat(parsedConfig.fileNames);

    // 创建 Program 实例
    const program = ts.createProgram(allFileNames, parsedConfig.options);

    return program;
}
function genServerEndPointType(
    sourceFile: ts.SourceFile,
    checker: ts.TypeChecker
) {
    // 查找默认导出声明
    let defaultExportType: string[] = [];
    let imports: string[] = [];

    sourceFile.forEachChild((node) => {
        // 处理导入声明
        if (ts.isExportAssignment(node)) {
            const type = checker.getTypeAtLocation(node.expression);
            /** @ts-ignore */
            const typeString = type.resolvedTypeArguments.map((i) => {
                return checker
                    .typeToString(
                        i,
                        node,
                        ts.TypeFormatFlags.UseFullyQualifiedType |
                            ts.TypeFormatFlags.NoTypeReduction |
                            ts.TypeFormatFlags
                                .UseAliasDefinedOutsideCurrentScope
                    )
                    .replace(/Promise<(.*?)>/, "$1");
            });
            defaultExportType = typeString;
        }
    });

    if (!defaultExportType) {
        return {};
    }
    const route = path
        .relative(getBasePath(), (sourceFile as any).path)
        .replaceAll("\\", "/")
        .replaceAll(".ts", "")
        .replace("server/routes/", "/");
    // 构建 .d.ts 内容
    const name = "server-endpoint" + route;

    const dtsContent = `
declare module "${name}" {
    ${imports.join("\n    ")}
    export type Input = ${defaultExportType[0]};
    export type Output = ${defaultExportType[1]};
}
`;

    const fetchContent = `
    "${route}": {
        url: process.env.BASE_ENDPOINT_URL + "${route}",
        fetch(input: ${defaultExportType[0]}): Promise<${defaultExportType[1]}> {
            return fetch(process.env.BASE_ENDPOINT_URL + "${route}", {
                method: "POST",
                body: JSON.stringify(input)
            }).then(res => res.json())
        }
    },
`;

    return {
        dts: dtsContent,
        fetch: fetchContent,
    };
}
