import { existsSync } from "fs";
import { mkdir } from "fs/promises";

export const createFolder = async (path: string, recursive: boolean = false) => {
	if (!existsSync(path)) await mkdir(path, { recursive });
};
