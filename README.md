English Readme

# Markdown Image

This is a copy extension of [vsc-markdown-image](https://github.com/imlinhanchao/vsc-markdown-image). This extension focus on supporting sync markdown images from other tools (cdn) to local files.

## Features

1. Copy image files or paste screenshots, right-click menu `Paste Image`.
2. Sync markdown images from other tools (cdn) to local files, right-click menu `Paste Markdown`.
3. Automatically generate Markdown code insertion.
4. Support Windows, MacOS, Linux.

## Requirements

Linux users must install xclip.

Ubuntu

```bash
sudo apt install xclip
```

CentOS

```bash
sudo yum install epel-release.noarch
sudo yum install xclip
```

## Extension Settings

### Base Settings

- `markdown-image.base.fileNameFormat`: The filename format for upload. You can use some variables. You can find more in setting.

### Local Settings

- `markdown-image.local.path`: Picture storage directory that in the local (automatically created if it does not exist). You can use some variables.

## Release Notes

### 1.0.0
- Init.

* [GitHub](https://github.com/wangtao0101/vsc-markdown-image)
* [VSCode Market](https://marketplace.visualstudio.com/items?itemName=hancel.markdown-image)

**Enjoy!**
