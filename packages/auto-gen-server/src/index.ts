import fs from "fs";
import ts from "typescript";
import path from "path";
import glob from "fast-glob";

export function main(
    sourcePath: string ='./server/routes/**/*.ts',
    targetPath: string = './dist/api-type.d.ts',
) {
    const program = createProgramWithConfig("./tsconfig.json", []);
    const checker = program.getTypeChecker();
    return glob(sourcePath, { absolute: true }).then((files) => {
        const codeParts = files
            .map((input) => {
                return genServerEndPointType(program.getSourceFile(input), checker);
            })
            .join("\n");
        fs.writeFileSync(path.resolve(basePath, targetPath), codeParts);
    });
}
function createProgramWithConfig(configFilePath, fileNames) {
    // 读取并解析 tsconfig.json 文件
    const configParseResult = ts.readConfigFile(configFilePath, ts.sys.readFile);

    if (configParseResult.error) {
        console.error(ts.formatDiagnostic(configParseResult.error, ts.createCompilerHost({})));
        return;
    }

    // 解析配置信息，获取编译选项和文件列表
    const configParseHost = {
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        useCaseSensitiveFileNames: () => false,
        getCurrentDirectory: () => basePath,
        getDirectories: (directoryName) => ts.sys.getDirectories(directoryName),
    };

    const parsedConfig = ts.parseJsonConfigFileContent(configParseResult.config, configParseHost, basePath);

    // 如果你有额外的文件需要加入编译，可以在这里添加
    const allFileNames = fileNames.concat(parsedConfig.fileNames);

    // 创建 Program 实例
    const program = ts.createProgram(allFileNames, parsedConfig.options);

    return program;
}
function genServerEndPointType(sourceFile, checker) {
    // 查找默认导出声明
    let defaultExportType;
    sourceFile.forEachChild((node) => {
        if (ts.isExportAssignment(node)) {
            const type = checker.getTypeAtLocation(node.expression);
            const typeString = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
            defaultExportType = typeString;
        }
    });

    if (!defaultExportType) {
        return "";
    }
    // 构建 .d.ts 内容
    const name = "#server-endpoint/" + path.relative(basePath, sourceFile.path).replaceAll("\\", "/");
    const dtsContent = `
declare module "${name}" {
    type API = ${defaultExportType};
    export type Input = API extends WrappedEventHandler<infer I, infer O> ? NonNullable<I> : undefined;
    export type Output = API extends WrappedEventHandler<infer I, infer O> ? NonNullable<Awaited<O>> : undefined;

}
`;

    return dtsContent;
}
