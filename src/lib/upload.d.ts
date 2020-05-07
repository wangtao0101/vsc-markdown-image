interface Upload
{
    config: Config;
    getSavePath(filePath: string): Promise<string|null>;
    upload(filePath: string): Promise<string|null>;
    reconfig(config: Config): Promise<void>;
}