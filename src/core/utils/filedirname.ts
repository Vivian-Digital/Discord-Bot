import { fileURLToPath } from 'url';
import { dirname } from 'path';

/* ES6 __dirname alternative */
export const FileDirName = (meta: ImportMeta) => {
    const __filename = fileURLToPath(meta.url)
    const __dirname = dirname(__filename)
    return { __dirname, __filename }
}
