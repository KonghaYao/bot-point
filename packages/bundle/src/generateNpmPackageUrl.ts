export function generateNpmPackageUrl(
    packageName: string,
    version: string,
    registry = "https://registry.npmjs.org"
) {
    // 对于带有作用域的包名（如 @scope/package-name），需要将斜杠替换为 %2F
    const encodedPackageName = packageName.includes("/")
        ? packageName.replace(/\//g, "%2F")
        : packageName;

    return {
        filename: `${encodedPackageName}-${version}.tgz`,
        folderName: `${encodedPackageName}-${version}`,
        full: `${registry}/${encodedPackageName}/-/${encodedPackageName}-${version}.tgz`,
    };
}
