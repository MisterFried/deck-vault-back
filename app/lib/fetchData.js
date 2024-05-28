import fetch from "node-fetch";

/**
 * Asynchronously fetches cards and sets data, processes and organizes the data, and returns an object containing the processed cards, archetypes, images, sets, and prints.
 *
 * @return {Object} An object containing the processed cards, archetypes, images, sets, and prints
 */
export default async function fetchData() {
	// Fetch cards data
	const cardsResponse = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
	const cardsData = await cardsResponse.json();
	const YGOProCardList = cardsData.data;

	// Fetch sets data
	const setsResponse = await fetch("https://db.ygoprodeck.com/api/v7/cardsets.php");
	const YGOProSetList = await setsResponse.json();

	// Ids
	let cardID = 1;
	let productID = 1;
	let imageID = 1;
	let archetypeID = 1;
	let printID = 1;
	let monsterCategoryID = 1;

	// Datas
	const cards = [];
	const archetypes = [];
	const images = [];
	const sets = [];
	const prints = [];
	const monsterCategory = [];

	//*** Sets data loop ***//
	YGOProSetList.forEach(set => {
		const setDate = set.tcg_date === "0000-00-00" ? "1000-01-01" : set.tcg_date;
		sets.push({
			id: productID++,
			name: set.set_name,
			code: set.set_code,
			date: new Date(setDate),
			cardsAmount: set.num_of_cards,
		});
	});

	//*** Cards data loop ***//
	YGOProCardList.forEach(card => {
		// Card data
		const newCard = {
			id: cardID,
			name: card.name,
			category: card.type,
			description: card.desc,
			attribute: card.attribute || null,
			level: card.level || null,
			type: card.race || null,
			atk: card.atk || null,
			def: card.def || null,
			archetype: card.archetype || null,
			link: card.linkval || null,
			scale: card.scale || null,
			banlist: "Unlimited",
		};
		if (card.banlist_info && card.banlist_info.ban_tcg)
			newCard.banlist = card.banlist_info.ban_tcg;

		cards.push(newCard);

		// Add monster category if not already added
		const isMonsterCategoryAlreadyAdded = monsterCategory.some(
			category => category.name === card.type
		);
		if (card.type && !isMonsterCategoryAlreadyAdded) {
			monsterCategory.push({
				id: monsterCategoryID++,
				name: card.type,
			});
		}

		// Add archetype if not already added
		const isArchetypeAlreadyAdded = archetypes.some(
			archetype => archetype.name === card.archetype
		);
		if (card.archetype && !isArchetypeAlreadyAdded) {
			archetypes.push({
				id: archetypeID++,
				name: card.archetype,
			});
		}

		// Add images (including alt images)
		card.card_images.forEach(image => {
			images.push({
				id: imageID++,
				cardID: cardID,
				imageID: image.id,
			});
		});

		// Add prints for each card in each set
		if (card.card_sets) {
			card.card_sets.forEach(set => {
				const correspondingSet = sets.find(
					s => s.name.toLowerCase() === set.set_name.toLowerCase()
				);

				// Case when the card is said to have a print in a specific set,
				// But the set doesn't exist yet
				if (!correspondingSet) return;

				prints.push({
					id: printID++,
					cardID: cardID,
					setID: correspondingSet.id,
					rarity: set.set_rarity,
					code: set.set_code,
				});
			});
		} // Else it means that the card has not been printed in any TCG set yet

		cardID++;
	});

	return { cards, archetypes, images, sets, prints, monsterCategory };
}
