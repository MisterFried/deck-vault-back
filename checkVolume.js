import fs from "fs";

export default function checkVolume() {
	const path = "/fetched-data";
	console.log("Checking if data exists in the volume...");

	if (!fs.existsSync(path) || fs.readdirSync(path).length === 0) {
		console.log("Volume is empty");
		return false;
	}

	console.log("Volume already populated with data");
	return true;
}
