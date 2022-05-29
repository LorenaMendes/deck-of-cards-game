# Deck of Cards Game

This project implements an interface (server and client) for the management of a simple game of cards. The backend implements an API that provides operations related to games, players, and decks, such as:
- create a game
- delete a game
- add a player to a game
- remove a player from a game
- add a deck to a game
- deal a cart to a player
- shuffle the game's deck
- and so on :)

The frontend implements a really basic interface that consumes this API and allows the user to make the operations and see its results.

As per the image below, there are three sections in the interface:
- On the right, existing games are shown. It is possible to create a game by writing a name for it in the entry and clicking the plus button. Click on a game's name to see its details.
- In the upper left section there are game details such as number of decks, number of cards not dealt, number of dead cards (represents the cards of a player who has been kicked out of the game). There is also a panel containing the number of undealted cards by suit and value. There are two buttons in the upper right corner of this section: one for adding a deck to the game and one for shuffling the deck. It is also possible to add a player (by typing a name in the entry and clicking the plus button) and delete a player by clicking the remove button on the right. To view a player's details, click on their name.
- In the lower left corner, you can see details of a player. At the bottom of this section, there is an entry where we can add the number of cards to be dealt to that player. By clicking on the plus button, the cards are dealt and the deck is decreased.

![game-of-cards-interface](https://user-images.githubusercontent.com/35077553/170894391-e0311c74-8f1d-4764-b788-e766c74022fb.png)

To run the application, you need to follow the steps below:
1. Clone the repository
```bash
git clone https://github.com/LorenaMendes/deck-of-cards-game.git
```
2. Go tho the cloned directory and install the dependencies
```bash
cd deck-of-cards-game
npm install
```

3. Run the application
```bash
npm start
```

4. Access the application at http://localhost:3333.
