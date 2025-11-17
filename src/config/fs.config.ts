import path from 'path'
import fs from 'fs'

namespace FS {
    export function initDefaultFolders() {
        const UPLOAD_FOLDER: boolean = fs.existsSync(path.join(process.cwd(), '/upload'));
        if (!UPLOAD_FOLDER) {
            fs.mkdirSync(path.join(process.cwd(), '/upload'));
        }
    }

    export function runner() {
        initDefaultFolders()
    }
}

export default FS