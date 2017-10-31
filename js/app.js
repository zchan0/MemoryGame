const CardStatus = {
    OPEN: 'open',
    MATCH: 'match',
    UNMATCH: 'unmatch',
    CLOSE: 'close'
};
Object.freeze(CardStatus);

const Card = function(id, symbol) {
    this.init(id, symbol);
};

Card.prototype = {
    init: function(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.status = CardStatus.CLOSE;
        this.HTMLElement = (function() {
            const i = document.createElement('i');
            i.classList.add('fa', symbol);
            const li = document.createElement('li');
            li.id = id;
            li.classList.add('card', CardStatus.CLOSE);
            li.appendChild(i);
            return li;
        })();  
    },
    isClickable: function() {
        return this.status === CardStatus.CLOSE;
    },
    isMatched: function(otherCard) {
        return this.symbol === otherCard.symbol;
    },
    reset: function(symbol) { 
        const li = document.getElementById(this.id);
        const i = li.firstChild;
        i.classList.replace(this.symbol, symbol);
        this.symbol = symbol;
        this.setStatus(CardStatus.CLOSE);
    },
    addClickHandler: function(clickHandler) {
        const li = document.getElementById(this.id);
        li.onclick = clickHandler;
    },
    setStatus: function(status) {
        const li = document.getElementById(this.id);
        li.classList.replace(this.status, status);
        this.status = status;
    }
};

const Deck = function() {
    this.init();
};

Deck.prototype = {
    init: function() {
        this.dimension = 4;
        this.cards = [];
        this.symbols = makeSymbolsArray();
        for (let i = 0; i < this.dimension * this.dimension; ++i) {
            let id = '' + i;
            this.cards.push(new Card(id, this.symbols[i]));
        }
    },
    draw: function() {
        const ul = document.createElement('ul');
        ul.classList.add('deck');
        this.cards.forEach(function(card) {
            ul.appendChild(card.HTMLElement);
        });
        document.getElementsByClassName('container')[0].appendChild(ul);
    },
    reset: function() {
        this.symbols = makeSymbolsArray();
        for (let i = 0; i < this.dimension * this.dimension; ++i) {
            this.cards[i].reset(this.symbols[i]);
        }
    },
    setupCardClickHandler: function(clickHandler) {
        this.cards.forEach(function(card) {
            card.addClickHandler(clickHandler);
        });
    }
};

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

const STAR = 'fa-star';
const STARO = 'fa-star-o';

const Controller = function() {
    this.init();  
};
    
Controller.prototype = {
    init: function() {     
        this.deck = new Deck();
        this.moves = 0;
        this.stars = 3;
        this.openCards = [];
    },
    updateRatings: function() {
        const dimStars = Math.floor(this.moves / 9);    // < 9 moves, 3 starrs; 9 <= moves < 18, 2 stars, etc.
        this.updateStars(dimStars);
        this.updateMoves();
    },
    resetRatings: function() {
        this.moves = 0;
        this.updateMoves();
        // reset stars
        const is = document.querySelectorAll('ul.stars>li>i.fa');
        const isArray = Array.prototype.slice.call(is);
        isArray.forEach(function(i) {
            if (i.classList.contains(STARO)) {
                i.classList.replace(STARO, STAR);
            }
        });
    },
    updateMoves: function() {
        const span = document.querySelector('span.moves');
        span.textContent = this.moves;
    },
    updateStars: function(dimStars) {
        dimStars = Math.min(3, dimStars); 
        this.stars = 3 - dimStars;
        const is = document.querySelectorAll('ul.stars>li>i.fa');
        for (let i = 2; dimStars > 0 && i >= 0; --dimStars, --i) {
            is[i].classList.replace(STAR, STARO);
        }
    },
    // convenient function, called when two cards get compared
    increMoves: function() {
        this.moves++;
        this.updateRatings(); // NOT updateMoves. 
    },
    startNewGame: function() {
        this.deck.draw();
        // cannot put following statements to init()
        this.deck.setupCardClickHandler(clickHandler);
    },
    resetGame: function() {
        this.deck.reset();
        this.resetRatings();
        this.openCards = [];
    },
};

const controller = new Controller();
controller.startNewGame();

function resetGame() {
    controller.resetGame();
}

function clickHandler(event) {
    const li = event.target;
    const card = controller.deck.cards[li.id]; // card clicked
    if (card.isClickable()) {
        card.setStatus(CardStatus.OPEN);
        // openCards is empty
        if (!controller.openCards.length) {
            controller.openCards.push(card);
        } 
        // compare two cards
        else {
            controller.increMoves();
            const topCard = controller.openCards.pop();
            // not match
            if (!card.isMatched(topCard)) {
                card.setStatus(CardStatus.UNMATCH);
                topCard.setStatus(CardStatus.UNMATCH);
                setTimeout(function() {
                    card.setStatus(CardStatus.CLOSE);
                    topCard.setStatus(CardStatus.CLOSE);
                }, 1000 * 1);
            } 
            // get matched
            else {
                card.setStatus(CardStatus.MATCH);
                topCard.setStatus(CardStatus.MATCH);
                // check if wins
            }
        }
    } else {
        console.log('card is not clickable');
    }
}