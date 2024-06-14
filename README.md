# DeckVault - Back

DeckVault is the backend service providing detailed information about cards from the Yu-Gi-Oh! Trading Card Game (TCG). The API offers various endpoints to retrieve specific card details and related data.

## Getting Started

These instructions will help you set up a copy of the deckVault backend on your local machine for development and testing purposes.

### Prerequisites

-   Node.js
-   Docker
-   Docker Compose

### Installation

Clone the repository to your local machine:

```sh
git clone https://github.com/MisterFried/deck-vault-back.git

cd deck-vault-back
```

Start the application using Docker compose:

```sh
docker-compose up --build --watch
```

The API should now be accessible via _localhost:3000_.

### API Endpoints

#### Cards

/cards - Returns all existing cards.

/cards/monster - Returns all monster cards.

/cards/spell - Returns all spell cards.

/cards/trap - Returns all trap cards.

/cards/search/:name - Searches for a card with the specified name.

/cards/:name - Searches all cards containing the specified name in their title.

#### Sets

/sets - Returns a list of all existing sets.

/sets/:code - Returns cards contained in the specified set.

#### Archetypes

/archetypes - Returns a list of all existing archetypes.

/archetypes/:name - Returns all cards with the specified archetype.

_Note: a card can only have a single archetype_

#### Banlist

/banlist - Returns all cards on the banlist (banned, limited, semi-limited).

/banlist/banned - Returns all banned cards.

/banlist/limited - Returns all limited cards.

/banlist/semi-limited - Returns all semi-limited cards.

### Source / Credits

All card data is sourced from the YuGiOhPro Deck public [API](https://ygoprodeck.com/api-guide/).

### How it Works

Upon initialization, DeckVault fetches data from the YuGiOhPro Deck API and saves it locally to prevent subsequent fetches on next runs. Two Docker containers are created:

A MySQL database container.
A Node/Express server container.

Tables are then created and populated in the database. Once finished, the server will be up and running, available at localhost:3000.

Any changes to the local files inside the app directory will be synced with the container, and the app then reloaded thanks to nodemon.
Changes outside the app directory (e.g. : package.json, config file, ...) will need a manual restart of the containers.

### Build With

Node.js - The runtime environment
Express - The web application framework
MySQL2 - MySQL client for Node.js

MySQL - The database used

Docker - Containerization platform
Docker Compose - Tool for defining and running multi-container Docker applications
