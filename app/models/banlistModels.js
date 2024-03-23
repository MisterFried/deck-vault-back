import { getDatabase } from "../lib/databaseInit.js";

export async function getBanlist() {
	const db = await getDatabase();
	const [rows] = await db.execute(
		"SELECT * FROM cards WHERE banlist = 'Banned' OR banlist = 'Limited' OR banlist = 'Semi-Limited'"
	);
	return rows;
}
