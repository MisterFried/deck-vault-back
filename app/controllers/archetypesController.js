import { getArchetypesList, getArchetypeCards } from "../models/archetypesModels.js";

// Get the list of all the archetypes
export async function processArchetypesList() {
	const archetypesList = await getArchetypesList();

	//Convert from an array of objects to an array of strings
	const processedArchetypesList = archetypesList.map(archetype => archetype.name);
	return processedArchetypesList;
}

// Get the list of all the cards of the specified archetype along with some additional information
export async function processArchetypeCards(name, search, page, perPage) {
	const archetypesList = await processArchetypesList();

	const matchingArchetype = archetypesList.find(
		archetype => archetype.toLowerCase() === name.toLowerCase()
	);

	if (!matchingArchetype) return null;

	const archetypeCards = await getArchetypeCards(name, search, page, perPage);

	// Convert the image IDs from a string to an array of numbers
	archetypeCards.cards.forEach(card => {
		card.images = card.images.split(",").map(id => Number(id));
	});

	return { archetype: matchingArchetype, ...archetypeCards };
}
