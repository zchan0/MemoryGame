//
// ─── STOPWATCH ──────────────────────────────────────────────────────────────────
//

const Stopwatch = function(el) {
    this.timeValue = '';
    this.el = el;   
};

Stopwatch.prototype.start = function() {
    this.beginTime = new Date().getTime();
    this.intervalID = setInterval(this.update.bind(this), 1000);    // use bind(this) to change the context of setInterval, otherwise update cannot access this 
};
Stopwatch.prototype.stop = function() {
    this.endTime = new Date().getTime();
    this.update();
    clearInterval(this.intervalID);
};
Stopwatch.prototype.reset = function() {
    this.timeValue = '';
    this.el.textContent = '';
    if (this.intervalID) clearInterval(this.intervalID);
};
Stopwatch.prototype.update = function() {
    this.currentTime = new Date().getTime();
    this.timeValue = ''; // reset

    const duration = this.currentTime - this.beginTime; // calculate time elapsed
    const hh = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 0 ~ 23
    const mm = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); // 0 ~ 59
    const ss = Math.floor((duration % (1000 * 60)) / 1000); // 0 ~ 59

    if (hh) this.timeValue = hh + ` hours `;
    if (mm) this.timeValue = mm + ` mins `;
    this.timeValue += (ss < 10 ? ('0' + ss) : ss) + ' secs';
    
    this.el.textContent = 'in ' + this.timeValue;
};
Stopwatch.prototype.getDuration = function() {
    return this.timeValue;
};

//
// ─── CARD ───────────────────────────────────────────────────────────────────────
//

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

Card.prototype.init = function(id, symbol) {
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
};
Card.prototype.isClickable = function() {
    return this.status === CardStatus.CLOSE;
};
Card.prototype.isMatched = function(otherCard) {
    return this.symbol === otherCard.symbol;
};
Card.prototype.reset = function(symbol) { 
    const li = document.getElementById(this.id);
    const i = li.firstChild;
    i.classList.replace(this.symbol, symbol);
    this.symbol = symbol;
    this.setStatus(CardStatus.OPEN);
};
Card.prototype.addClickHandler = function(clickHandler) {
    const li = document.getElementById(this.id);
    li.onclick = clickHandler;
};
Card.prototype.setStatus = function(status) {
    const li = document.getElementById(this.id);
    const oldAnimation = this.getAnimatedName(this.status);
    const newAnimation = this.getAnimatedName(status);
    li.classList.replace(oldAnimation, newAnimation);   // to use replace, MUST setup initial animation class 
    li.classList.replace(this.status, status);
    this.status = status;
};
Card.prototype.getAnimatedName = function(status) {
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
};

//
// ─── DECK ───────────────────────────────────────────────────────────────────────
//

const Deck = function() {
    this.init();
};

Deck.prototype.init = function() {
    this.dimension = 4;
    this.cards = [];
    this.symbols = makeSymbolsArray();
    for (let i = 0; i < this.dimension * this.dimension; ++i) {
        let id = '' + i;
        this.cards.push(new Card(id, this.symbols[i]));
    }
};
Deck.prototype.draw = function() {
    const ul = document.createElement('ul');
    ul.classList.add('deck');
    this.cards.forEach(function(card) {
        ul.appendChild(card.HTMLElement);
    });
    document.getElementsByClassName('container')[0].appendChild(ul);
};
Deck.prototype.reset = function() {
    this.symbols = makeSymbolsArray();
    for (let i = 0; i < this.dimension * this.dimension; ++i) {
        this.cards[i].reset(this.symbols[i]);
    }
};
Deck.prototype.closeCards = function() {
    this.cards.forEach(function(card) {
        card.setStatus(CardStatus.CLOSE);
    });
};
Deck.prototype.setupCardClickHandler = function(clickHandler) {
    this.cards.forEach(function(card) {
        card.addClickHandler(clickHandler);
    });
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

//
// ─── CONTROLLER ─────────────────────────────────────────────────────────────────
//

const STAR = 'fa-star';
const STARO = 'fa-star-o';

const Controller = function() {
    this.init();  
};
    
Controller.prototype.init = function() {    
    // init deck 
    this.deck = new Deck();
    this.deck.draw();
    this.deck.setupCardClickHandler(clickHandler);
    // init score panel
    this.moves = 0;
    this.stars = 3;
    this.openCards = [];
    const stopwatchEl = document.querySelector('.timer>.stopwatch');
    this.stopwatch = new Stopwatch(stopwatchEl);
};
Controller.prototype.updateRatings = function() {
    const dimStars = Math.floor(this.moves / 12);
    this.updateStars(dimStars);
    this.updateMoves();
};
Controller.prototype.resetRatings = function() {
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
};
Controller.prototype.updateMoves = function() {
    const span = document.querySelector('span.moves');
    span.textContent = this.moves;
};
Controller.prototype.updateStars = function(dimStars) {
    dimStars = Math.min(2, dimStars); // at least 1 star
    this.stars = 3 - dimStars;
    const is = document.querySelectorAll('ul.stars>li>i.fa');
    for (let i = 2; dimStars > 0 && i >= 0; --dimStars, --i) {
        is[i].classList.replace(STAR, STARO);
    }
};

// convenient function, called when two cards get compared
Controller.prototype.increMoves = function() {
    this.moves++;
    this.updateRatings(); // NOT updateMoves. 
}
Controller.prototype.startNewGame = function() {
    setTimeout(() => {
        this.deck.closeCards();
        // stopwatch
        this.stopwatch.el.classList.remove('hidden');
        this.stopwatch.start();
    }, 1000 * 3);
};
Controller.prototype.resetGame = function() {
    this.deck.reset();
    this.stopwatch.reset();
    this.stopwatch.el.classList.add('hidden');
    this.resetRatings();
    this.openCards = [];
    this.startNewGame();
};
Controller.prototype.hasWon = function() {
    let hasWon = true;
    this.deck.cards.forEach(function(card) {
        if (card.status === CardStatus.CLOSE) {
            hasWon = false;
        }
    });
    return hasWon;
};
Controller.prototype.toggleCongrats = function() {
    const modal = document.querySelector('.modal');
    const p = document.querySelector('.modal>p');
    p.textContent = 'With ' + this.moves + ' Moves and ' + this.stars + ' Stars In ' + this.stopwatch.getDuration() + '!';
    modal.classList.toggle('hidden');
    if (modal.classList.contains('bounceIn')) {
        modal.classList.remove('bounceIn');
    } else {
        modal.classList.add('bounceIn');
    }
};

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

const controller = new Controller();
controller.startNewGame();

function resetGame() {
    controller.resetGame();
}

function playAgain() {
    controller.resetGame();
    controller.toggleCongrats();
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
                }, 600 * 1);
            } 
            // get matched
            else {
                card.setStatus(CardStatus.MATCH);
                topCard.setStatus(CardStatus.MATCH);
                // check if wins
                if (controller.hasWon()) {
                    controller.stopwatch.stop();
                    controller.toggleCongrats();
                }
            }
        }
    } else {
        console.log('card is not clickable');
    }
}