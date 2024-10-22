import path from 'path'
import fs from 'fs'

function initDefaultFolders() {
    const UPLOAD_FOLDER: boolean = fs.existsSync(path.join(process.cwd(), '/upload'));
    if (!UPLOAD_FOLDER) {
        fs.mkdirSync(path.join(process.cwd(), '/upload'));
    }
}

export default initDefaultFolders
