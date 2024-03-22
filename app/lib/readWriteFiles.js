import fs from "fs";

export async function readLargeFile(path) {
	return new Promise((resolve, reject) => {
		let data = "";

		const readStream = fs.createReadStream(path);
		readStream.on("data", chunk => {
			data += chunk;
		});
		readStream.on("end", () => {
			resolve(data);
		});
		readStream.on("error", err => {
			reject(err);
		});
	});
}

export async function writeLargeFile(path, data) {
	return new Promise((resolve, reject) => {
		const writeStream = fs.createWriteStream(path);

		writeStream.write(data, "utf8", err => {
			if (err) reject(err);
			else resolve();
		});

		writeStream.end();
	});
}
