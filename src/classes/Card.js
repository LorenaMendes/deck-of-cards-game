class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        switch (value) {
            case 1:
                this.face = 'A'
                break;
            case 11:
                this.face = 'J'
                break;
            case 12:
                this.face = 'Q'
                break;
            case 13:
                this.face = 'K'
                break;
            default:
                this.face = value.toString();
                break;
        }
    }
}

module.exports = Card;