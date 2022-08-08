import { existsSync } from "fs";
import { access, mkdir } from "fs/promises";

export const createFolder = async (path: string, recursive: boolean = false) => {
	if (!existsSync(path)) await mkdir(path, { recursive });
};

export const fileExists = async (filePath: string) => {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
};
