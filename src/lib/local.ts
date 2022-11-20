import utils from './utils';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { locale as $l } from './utils';

class Local implements Upload
{
    config: Config;
    constructor(config: Config) {
        this.config = config;
    }

    async reconfig(config: Config) {
        this.config = config;
    }

    async upload(filePath: string, savePath: string): Promise<string | null> {
        try {
            if (!utils.getCurrentRoot()) {
                vscode.window.showInformationMessage($l['open_with_folder']);
                return null;
            }

            const configPath = await utils.formatPath(this.config.local.path);

            let saveFolder = configPath.startsWith('/') ? 
                path.join(utils.getCurrentRoot(), configPath) :
                path.resolve(path.dirname(utils.getCurrentFilePath()), configPath);
            
            console.debug(`Create Project Upload Folder.`);
            
            savePath = path.resolve(saveFolder, savePath);
            saveFolder = path.dirname(savePath);

            if (!fs.existsSync(saveFolder)) {
                utils.mkdirs(saveFolder);
            }

            if (fs.existsSync(savePath) && 
            (await utils.confirm($l['replace_or_no'], [$l['Yes'], $l['No']])) === $l['No']) {
                return savePath;
            }
            fs.copyFileSync(filePath, savePath);

            if(this.config.local.referencePath === '') { 
                return path.relative(path.dirname(utils.getCurrentFilePath()), savePath).replace(/\\/g, '/'); 
            }
            
            return path.join(await utils.formatName(this.config.local.referencePath, savePath, false), path.basename(savePath)).replace(/\\/g, '/')
        }
        catch(error) {
            let e = error as Error; 
            vscode.window.showInformationMessage(`${$l['save_failed']}${e.message}`);
            return null;
        }
    }
}

export default Local;