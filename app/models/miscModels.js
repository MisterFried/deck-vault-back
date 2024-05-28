import { getDatabase } from "../lib/databaseInit.js";

export async function getMonsterCategories() {
	const db = await getDatabase();

	const [rows] = await db.execute("SELECT id, name FROM monster_category");
	return rows;
}
