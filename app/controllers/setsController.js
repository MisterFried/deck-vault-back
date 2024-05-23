import { getSetsList, getSetBreakdown } from "../models/setsModels.js";

// Get the list of all the sets
export async function processSetsList() {
	const setsList = await getSetsList();

	return setsList;
}

// Get the breakdown of the specified set will all its variants
export async function processSetBreakdown(code) {
	const setsList = await getSetsList();

	// Check if the specified set exists
	const setVariants = setsList.filter(set => set.code === code);
	if (setVariants.length === 0) return null;

	const setBreakdown = await getSetBreakdown(setVariants);

	// Prevent duplicate cards by regrouping identical cards with different rarity
	setBreakdown.forEach(variant => {
		const rarityGroupedCards = [];

		variant.cards.forEach(card => {
			const existingCard = rarityGroupedCards.find(c => c.name === card.name);

			if (!existingCard) {
				rarityGroupedCards.push({ ...card, rarity: [card.rarity] });
			} else {
				existingCard.rarity.push(card.rarity);
			}
		});

		// Convert the image IDs from a string to an array of numbers
		rarityGroupedCards.forEach(card => {
			card.images = card.images.split(",").map(id => Number(id));
		});

		variant.cards = rarityGroupedCards;
	});

	return setBreakdown;
}
