import { getSets, getSetBreakdown } from "../models/setsModels.js";

export async function processSets() {
	const setsDB = await getSets();
	const processedSets = setsDB.map(set => {
		return {
			name: set.name,
			code: set.code,
			date: set.date,
			cards_amount: set.cards_amount,
		};
	});
	return processedSets;
}

export async function processSetBreakdown(code) {
	const setsList = await getSets();
	const matchingSetVariants = setsList.filter(set => set.code === code);
	if (matchingSetVariants.length === 0) return null;

	const variantsDetails = matchingSetVariants.map(variant => {
		return {
			name: variant.name,
			code: variant.code,
			date: variant.date,
			id: variant.id,
		};
	});
	const setBreakdown = await getSetBreakdown(variantsDetails);

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

		variant.cards = rarityGroupedCards;
	});

	return setBreakdown;
}
