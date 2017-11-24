//
// ─── CARD ───────────────────────────────────────────────────────────────────────
//

export const CardStatus = {
    OPEN: 'open',
    MATCH: 'match',
    UNMATCH: 'unmatch',
    CLOSE: 'close'
};
Object.freeze(CardStatus);

export class Card {
    constructor(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.status = CardStatus.OPEN;
        this.HTMLElement = (function() {
            const i = document.createElement('i');
            i.classList.add('fa', symbol);
            const li = document.createElement('li');
            li.id = id;
            li.classList.add('card', 'animated', 'pulse', CardStatus.OPEN);
            li.appendChild(i);
            return li;
        })();  
    }

    isClickable() {
        return this.status === CardStatus.CLOSE;
    }

    isMatched(otherCard) {
        return this.symbol === otherCard.symbol;
    }

    reset(symbol) {
        const li = document.getElementById(this.id);
        const i = li.firstChild;
        i.classList.replace(this.symbol, symbol);
        this.symbol = symbol;
        this.setStatus(CardStatus.OPEN);
    }

    addClickHandler(clickHandler) {
        const li = document.getElementById(this.id);
        li.onclick = clickHandler;
    }

    setStatus(status) {
        const li = document.getElementById(this.id);
        const oldAnimation = this.getAnimatedName(this.status);
        const newAnimation = this.getAnimatedName(status);
        li.classList.replace(oldAnimation, newAnimation);   // to use replace, MUST setup initial animation class 
        li.classList.replace(this.status, status);
        this.status = status;
    }

    getAnimatedName(status) {
        switch (status) {
            case CardStatus.CLOSE:
                return 'flipInY'; break;
            case CardStatus.OPEN:
                return 'pulse'; break;
            case CardStatus.MATCH:
                return 'rubberBand'; break;
            case CardStatus.UNMATCH:
                return 'shake'; break;
        }
    }
}

//
// ─── DECK ───────────────────────────────────────────────────────────────────────
//

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function makeSymbolsArray() {
    const symbolsArray = [
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-leaf',
        'fa-bicycle',
        'fa-bomb',
    ];
    let cloneSymbolsArray = symbolsArray.slice();
    return shuffle(symbolsArray.concat(cloneSymbolsArray)); // x2
}

export class Deck {
    constructor() {
        this.dimension = 4;
        this.cards = [];
        this.symbols = makeSymbolsArray();
        for (let i = 0; i < this.dimension * this.dimension; ++i) {
            let id = '' + i;
            this.cards.push(new Card(id, this.symbols[i]));
        }
    }

    draw() {
        const ul = document.createElement('ul');
        ul.classList.add('deck');
        this.cards.forEach(function(card) {
            ul.appendChild(card.HTMLElement);
        });
        document.getElementsByClassName('container')[0].appendChild(ul);
    }

    reset() {
        this.symbols = makeSymbolsArray();
        for (let i = 0; i < this.dimension * this.dimension; ++i) {
            this.cards[i].reset(this.symbols[i]);
        }
    }

    closeCards() {
        this.cards.forEach(function(card) {
            card.setStatus(CardStatus.CLOSE);
        });
    }

    setupCardClickHandler(clickHandler) {
        this.cards.forEach(function(card) {
            card.addClickHandler(clickHandler);
        });
    }
}
