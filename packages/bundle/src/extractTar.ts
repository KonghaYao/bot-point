import { ensureDir, createReadStream } from "fs-extra";
import { extract as x } from "tar";
import { pipeline } from "node:stream/promises";

export async function extractTar(from: string, dir: string): Promise<void> {
    await ensureDir(dir);
    // 保证 有 dir 文件夹

    return pipeline(
        createReadStream(from),
        x({
            strip: 1,
            C: dir,
        })
    );
}
