import { existsSync } from "fs";
import { access, mkdir, readdir, rm, unlink } from "fs/promises";

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

export const deleteFile = async (filePath: string) => {
	try {
		await unlink(filePath);
		return true;
	} catch {
		return false;
	}
};

export const deleteFolder = async (path: string, recursive: boolean = false) =>
	rm(path, { recursive });

export const deleteFolderFiles = async (path: string) =>
	Promise.allSettled((await readdir(path)).map((fileName) => deleteFile(path + sep + fileName)));
