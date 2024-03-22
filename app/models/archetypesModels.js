import { getDatabase } from "../lib/databaseInit.js";

export async function getArchetypes() {
	const db = await getDatabase();
	const [rows] = await db.execute("SELECT name FROM archetypes");
	return rows;
}

export async function getArchetypeCards(name) {
	const db = await getDatabase();
	const [rows] = await db.execute(
		"SELECT name, attribute, level, type, category, description, atk, def, archetype, link, scale, banlist FROM cards WHERE archetype = ?",
		[name]
	);
	return rows;
}
