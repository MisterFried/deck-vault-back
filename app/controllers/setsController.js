import { getSets, getSetCards } from "../models/setsModels.js";

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

export async function processSetCards(code) {
	const setsList = await getSets();
	const matchingSets = setsList.filter(set => set.code === code);
	if (matchingSets.length === 0) return [];

	const matchingSetsId = matchingSets.map(set => {
		return {
			name: set.name,
			code: set.code,
			date: set.date,
			id: set.id,
		};
	});
	const setVariantsBreakdown = await getSetCards(matchingSetsId);

	// Prevent duplicate cards by regrouping identical cards with different rarity
	setVariantsBreakdown.forEach(variant => {
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

	return setVariantsBreakdown;
}
