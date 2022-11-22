import * as vscode from "vscode";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import utils from "./utils";
import { locale as $l } from "./utils";

interface MarkdownImage {
  name: string;
  originUrl: string;
  localPath: string;
  savePath: string;
}

async function downloadImage(url: string, filepath: string) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        if (res.statusCode === 302) {
          const newUrl = res.headers.location;
          resolve(downloadImage(newUrl!, filepath));
          return;
        }
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

function getImageReg() {
  return /\!\[(.*)\]\((.*)\)/g;
}

export async function copyMarkdown() {
  if (!utils.getCurrentRoot()) {
    vscode.window.showInformationMessage($l["open_with_folder"]);
    return null;
  }

  const config = utils.getConfig();
  const upload: Upload | null = utils.getUpload(config);

  const clipboard_content = await vscode.env.clipboard.readText();

  const items = clipboard_content.matchAll(getImageReg());

  const markdownImages: MarkdownImage[] = [];

  for (const item of items) {
    const originUrl = item[2];
    if (originUrl.startsWith("https://")) {
      const extReg = /https:\/\/.*\.(jpg|jpeg|gif|bmp|png|webp)/;
      const extRes = extReg.exec(originUrl);
      let savePath = utils.getTmpFolder();
      savePath = path.resolve(
        savePath,
        `pic_${new Date().getTime()}.${extRes != null ? extRes[1] : "png"}`
      );
      try {
        console.log(savePath);
        await downloadImage(originUrl, savePath);
        console.log("asdfasdf");
        const fileName = config.base.fileNameFormat
          ? (await utils.formatName(
              config.base.fileNameFormat,
              savePath,
              false
            )) + path.extname(savePath)
          : savePath;

        console.debug(`Uploading ${originUrl}: ${savePath} to ${fileName}.`);
        const localPath = await upload?.upload(savePath, fileName);

        if (localPath != null) {
          markdownImages.push({
            name: item[1],
            originUrl,
            savePath,
            localPath,
          });
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Download ${originUrl} failed`);
      }
    }
  }

  console.debug(markdownImages);

  const insertMarkdown = clipboard_content.replace(
    getImageReg(),
    (origin, _param1: string, param2) => {
      const matchImage = markdownImages.find((img) => img.originUrl === param2);
      if (matchImage) {
        return `![${matchImage.name}](${matchImage.localPath})`;
      }
      return origin;
    }
  );
  console.debug(`Insert markdown: ${insertMarkdown}`);
  return insertMarkdown;
}
