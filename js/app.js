const CardStatus = {
    OPEN: 'open',
    SHOW: 'show',
    MATCH: 'match',
    CLOSE: ''
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
            li.classList.add('card');
            li.appendChild(i);
            return li;
        })();  
    },
    isClickable: function() {
        return this.status === CardStatus.CLOSE;
    },
    reset: function(symbol) { 
        const li = document.getElementById(this.id);
        const i = li.firstChild;
        i.classList.remove(this.symbol);
        i.classList.add(symbol);
    },
    addClickHandler: function(clickHandler) {
        const li = document.getElementById(this.id);
        li.onclick = clickHandler;
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
        for (let i = 0; i < this.dimension; ++i) {
            for (let j = 0; j < this.dimension; ++j) {
                let id = '' + i + j;
                this.cards.push(new Card(id, this.symbols[i * this.dimension + j]));
            }
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

const Controller = function() {
    this.init();  
};
    
Controller.prototype = {
    init: function() {     
        this.deck = new Deck();
    },
    updateMoves: function(moves) {
        if (moves < 0) moves = 0;
        const span = document.querySelector('span.moves');
        span.textContent = moves;
        // update star rating
        if (moves < 20) {
            this.lightStars(3);
        } else if (moves < 40) {
            this.lightStars(2);
        } else {
            this.lightStars(1);
        }
    },
    resetMoves: function() {
        this.updateMoves(0);
    },
    lightStars: function(numOfStars) {
        const ul = document.querySelector('ul.stars');
        const star = 'fa-star';
        const staro = 'fa-star-o';
        for (let idx = numOfStars; idx < 3; ++idx) {
            const i = ul.children[idx].firstChild;  // ul.li.i
            i.classList.remove(star);
            i.classList.add(staro);
        }
    },
    startNewGame: function() {
        this.deck.draw();
        // cannot put following statements to init()
        this.deck.setupCardClickHandler(function(event) {
            console.log(event.target);
        });
    },
    resetGame: function() {
        this.deck.reset();
        this.resetMoves();
    },
};

const controller = new Controller();
controller.startNewGame();

function resetGame() {
    controller.resetGame();
}