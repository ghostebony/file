import archiver from "archiver";
import { createReadStream, createWriteStream, existsSync } from "fs";
import { access, mkdir, readdir, rm, unlink, writeFile } from "fs/promises";
import { sep } from "path";
import type { Stream } from "stream";
import { createGunzip, createGzip } from "zlib";

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

export const gzipFolder = async (filePath: string, folderPath: string) => {
	const archive = archiver("tar", { gzip: true });

	archive.pipe(createWriteStream(filePath));

	archive.directory(folderPath, false);

	await archive.finalize();
};

export const gzipFile = (filePath: string) =>
	createReadStream(filePath)
		.pipe(createGzip())
		.pipe(createWriteStream(filePath + ".gz"));

export const gunzipFile = (filePath: string) =>
	createReadStream(filePath)
		.pipe(createGunzip())
		.pipe(createWriteStream(filePath.split(".").slice(0, -1).join(".")));
