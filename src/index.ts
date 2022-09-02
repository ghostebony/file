import archiver from "archiver";
import { createReadStream, createWriteStream, existsSync } from "fs";
import { access, mkdir, readdir, rm, rmdir, unlink, writeFile } from "fs/promises";
import { sep } from "path";
import type { Stream } from "stream";
import { createGunzip, createGzip } from "zlib";

const file_create = async (path: string, fileName: string, data: string | Stream) => {
	const filePath = path + sep + fileName;

	await folder.create(path);

	await writeFile(filePath, data);

	return filePath;
};

export const file = {
	async download(url: string, folderPath: string) {
		const fileName = url.split("/").pop() || "unknown.file";

		const filePath = await file_create(
			folderPath,
			fileName,
			(await (await fetch(url)).blob()).stream()
		);

		return { fileName, filePath };
	},
	async exists(filePath: string) {
		try {
			await access(filePath);
			return true;
		} catch {
			return false;
		}
	},
	create: file_create,
	async delete(filePath: string) {
		try {
			await unlink(filePath);
			return true;
		} catch {
			return false;
		}
	},
	gzip(filePath: string) {
		return createReadStream(filePath)
			.pipe(createGzip())
			.pipe(createWriteStream(filePath + ".gz"));
	},
	gunzip(filePath: string) {
		return createReadStream(filePath)
			.pipe(createGunzip())
			.pipe(createWriteStream(filePath.split(".").slice(0, -1).join(".")));
	},
};

export const folder = {
	async create(path: string, recursive: boolean = false) {
		if (!existsSync(path)) await mkdir(path, { recursive });
	},
	async delete(path: string, recursive: boolean = false) {
		return rmdir(path, { recursive });
	},
	async deleteFiles(path: string) {
		return Promise.allSettled(
			(await readdir(path)).map((fileName) => file.delete(path + sep + fileName))
		);
	},
	async deleteWithFiles(path: string, recursive: boolean = false) {
		return rm(path, { recursive });
	},
	async gzip(filePath: string, folderPath: string) {
		const archive = archiver("tar", { gzip: true });

		archive.pipe(createWriteStream(filePath));

		archive.directory(folderPath, false);

		await archive.finalize();
	},
};

export default { file, folder };
