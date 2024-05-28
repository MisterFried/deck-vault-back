// Modules
import express from "express";

// Functions
import { databaseInit } from "./lib/databaseInit.js";

// Routes
import cardsRoutes from "./routes/cardsRoutes.js";
import archetypesRoutes from "./routes/archetypesRoutes.js";
import setsRoutes from "./routes/setsRoutes.js";
import banlistRoutes from "./routes/banlistRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";

async function startServer() {
	// Variables
	const PORT = process.env.PORT || 3000;

	// Start the server
	const app = express();
	app.use(express.json());
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

	await databaseInit();

	console.log("Setting up routes...");

	app.use("/cards", cardsRoutes);
	app.use("/archetypes", archetypesRoutes);
	app.use("/sets", setsRoutes);
	app.use("/banlist", banlistRoutes);
	app.use("/misc", miscRoutes);

	console.log("Everything is running fine !");
}

startServer();
