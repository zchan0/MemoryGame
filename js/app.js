import {Controller} from './controller.js';
import {CardStatus} from './model.js';

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

const controller = new Controller(clickHandler);
controller.startNewGame();