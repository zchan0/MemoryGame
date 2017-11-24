import {Card, Deck, CardStatus} from './model.js';
import {Stopwatch} from './stopwatch.js';

const STAR = 'fa-star';
const STARO = 'fa-star-o';

export class Controller {
    constructor(clickHandler) {
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
        // setup handlers
        this.setupHandlers();
    }

    setupHandlers() {
        const that = this;

        const restart = document.querySelector('.restart');
        restart.addEventListener('click', function() {
            that.resetGame();
        }, false);

        const btn = document.querySelector('.modal>button');
        btn.addEventListener('click', function() {
            that.resetGame();
            that.toggleCongrats();
        }, false);
    }

    // ratings
    updateRatings() {
        const dimStars = Math.floor(this.moves / 12);
        this.updateStars(dimStars);
        this.updateMoves();
    }

    resetRatings() {
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
    }

    // moves
    updateMoves() {
        const span = document.querySelector('span.moves');
        span.textContent = this.moves;
    }

    // stars
    updateStars(dimStars) {
        dimStars = Math.min(2, dimStars); // at least 1 star
        this.stars = 3 - dimStars;
        const is = document.querySelectorAll('ul.stars>li>i.fa');
        for (let i = 2; dimStars > 0 && i >= 0; --dimStars, --i) {
            is[i].classList.replace(STAR, STARO);
        }
    }

    // convenient function, called when two cards get compared
    increMoves() {
        this.moves++;
        this.updateRatings(); // NOT updateMoves.
    }

    startNewGame() {
        setTimeout(() => {
            this.deck.closeCards();
            // stopwatch
            this.stopwatch.el.classList.remove('hidden');
            this.stopwatch.start();
        }, 1000 * 3);
    }

    resetGame() {
        this.deck.reset();
        this.stopwatch.reset();
        this.stopwatch.el.classList.add('hidden');
        this.resetRatings();
        this.openCards = [];
        this.startNewGame();
    }

    hasWon() {
        let hasWon = true;
        this.deck.cards.forEach(function(card) {
            if (card.status === CardStatus.CLOSE) {
                hasWon = false;
            }
        });
        return hasWon;
    }

    toggleCongrats() {
        const modal = document.querySelector('.modal');
        const p = document.querySelector('.modal>p');
        p.textContent = 'With ' + this.moves + ' Moves and ' + this.stars + ' Stars In ' + this.stopwatch.getDuration() + '!';
        modal.classList.toggle('hidden');
        if (modal.classList.contains('bounceIn')) {
            modal.classList.remove('bounceIn');
        } else {
            modal.classList.add('bounceIn');
        }
    }
}
