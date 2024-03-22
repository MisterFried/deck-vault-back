import { getArchetypes, getArchetypeCards } from "../models/archetypesModels.js";

export async function processArchetypes() {
	const archetypesDB = await getArchetypes();
	const processedArchetypes = archetypesDB.map(archetype => archetype.name);
	return processedArchetypes;
}

export async function processArchetypeCards(name) {
	const archetypesList = await processArchetypes();
	if (!archetypesList.includes(name)) return [];

	const cardsListDB = await getArchetypeCards(name);
	return cardsListDB;
}
