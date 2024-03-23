import { getDatabase } from "../lib/databaseInit.js";

export async function getArchetypes() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT name FROM archetypes");
	return rows;
}

export async function getArchetypeCards(name) {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT * FROM cards WHERE archetype = ?", [name]);
	return rows;
}
