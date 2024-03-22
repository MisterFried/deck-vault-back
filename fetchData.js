import fetch from "node-fetch";

export default async function fetchData() {
	// Fetch cards data
	const cardsResponse = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
	const cardsData = await cardsResponse.json();
	const YGOProCardList = cardsData.data;

	// Fetch sets data
	const setsResponse = await fetch("https://db.ygoprodeck.com/api/v7/cardsets.php");
	const YGOProSetList = await setsResponse.json();

	// Ids
	let cardId = 1;
	let productId = 1;
	let imageId = 1;
	let archetypeId = 1;
	let printId = 1;

	// Datas
	const cards = [];
	const archetypes = [];
	const images = [];
	const sets = [];
	const prints = [];

	const alreadySeenArchetypes = []; // Keep track of already seen archetypes as a simple array

	//*** Sets data loop ***//
	YGOProSetList.forEach(set => {
		const setDate = set.tcg_date === "0000-00-00" ? "1000-01-01" : set.tcg_date;
		sets.push({
			id: productId++,
			name: set.set_name,
			code: set.set_code,
			date: setDate,
			cards_amount: set.num_of_cards,
		});
	});

	//*** Cards data loop ***//
	YGOProCardList.forEach(card => {
		// Card data
		const newCard = {
			id: cardId,
			name: card.name,
			category: card.type,
			description: card.desc,
		};
		if (card.attribute) newCard.attribute = card.attribute;
		if (card.level) newCard.level = card.level;
		if (card.race) newCard.type = card.race;
		if (card.atk) newCard.atk = card.atk;
		if (card.def) newCard.def = card.def;
		if (card.archetype) newCard.archetype = card.archetype;
		if (card.linkval) newCard.link = card.linkval;
		if (card.scale) newCard.scale = card.scale;
		newCard.banlist = card.banlist ? card.banlist : "Unlimited";
		cards.push(newCard);

		// Add archetype if not already added
		if (!alreadySeenArchetypes.includes(newCard.archetype) && newCard.archetype) {
			alreadySeenArchetypes.push(newCard.archetype);
			archetypes.push({
				id: archetypeId++,
				name: newCard.archetype,
			});
		}

		// Add images (including alt images)
		card.card_images.forEach(image => {
			images.push({
				id: imageId++,
				card_id: cardId,
				image_id: image.id,
			});
		});

		// Add prints for each card in each set
		if (card.card_sets) {
			card.card_sets.forEach(set => {
				const correspondingSet = sets.find(
					s => s.name.toLowerCase() === set.set_name.toLowerCase()
				);

				prints.push({
					id: printId++,
					card_id: cardId,
					product_id: correspondingSet.id,
					rarity: set.set_rarity,
					code: set.set_code,
				});
			});
		} // Else it means that the card has not been printed in any TCG set yet

		cardId++;
	});

	return { cards, archetypes, images, sets, prints };
}
