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
            i.id = id;
            const li = document.createElement('li');
            li.classList.add('card');
            li.appendChild(i);
            return li;
        })();  
    },
    isClickable: function() {
        return this.status === CardStatus.CLOSE;
    },
    reset: function(symbol) { 
        const i = document.getElementById(this.id);
        i.classList.remove(this.symbol);
        i.classList.add(symbol);
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
        this.moves = 0;
        this.drawMoves();        
    },
    startNewGame: function() {
        this.deck = new Deck();
        this.deck.draw();
    },
    drawMoves: function() {
        const ul = document.createElement('ul');
        ul.classList.add('stars');
        for (let i = 0; i < this.moves; ++i) {
            const i = document.createElement('i');
            i.classList.add('fa', 'fa-star');
            const li = document.createElement('li');
            li.appendChild(i);
            ul.appendChild(li);
        }
        document.getElementsByClassName('score-panel')[0].appendChild(ul);

        const span = document.createElement('span');
        span.classList.add('moves');
        span.textContent = this.moves + ' Moves';
        document.getElementsByClassName('score-panel')[0].appendChild(span);
    },
    resetGame: function() {
        this.moves = 0;
        this.deck.reset();
    }
};

let controller = new Controller();
controller.startNewGame();