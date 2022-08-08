import { existsSync } from "fs";
import { access, mkdir, readdir, rm, unlink, writeFile } from "fs/promises";
import { sep } from "path";

export const downloadFile = async (url: string, folderPath: string) => {
	const fileName = url.split(sep).pop() || "unknown.file";

	const filePath = await createFile(
		folderPath,
		fileName,
		(await (await fetch(url)).blob()).stream()
	);

	return { fileName, filePath };
};

export const createFolder = async (path: string, recursive: boolean = false) => {
	if (!existsSync(path)) await mkdir(path, { recursive });
};

export const createFile = async (path: string, fileName: string, data: string | Stream) => {
	const filePath = path + sep + fileName;

	await createFolder(path);

	await writeFile(filePath, data);

	return filePath;
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
