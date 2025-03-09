import { createReadStream } from "fs";
import { ensureDir } from "fs-extra";
import { extract as x } from "tar";

export async function extractTar(from: string, dir: string): Promise<void> {
    await ensureDir(dir);
    // 保证 有 dir 文件夹
    return new Promise((resolve) => {
        createReadStream(from).pipe(
            x({
                strip: 1,
                C: dir,
                ondone() {
                    resolve(void 0);
                },
            })
        );
    });
}
