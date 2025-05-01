const COLORS = ['d','h','s','c'];
const VALUES = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
 
let board;
let playerHand;
let dealerHand;
let currentBet;
let turn;
let winner;
let playerTotal;
let dealerTotal;
let currentChips = 100;

const betVal = document.querySelector('#betVal');
const chipsVal= document.querySelector('#chips');
const messageEl = document.querySelector('#message');

document.querySelector('#bet').addEventListener('click',bet);
document.querySelector('#hit').addEventListener('click',hit);
document.querySelector('#stand').addEventListener('click',stand);
document.querySelector('#deal').addEventListener('click', deal);
document.querySelector('#continue').addEventListener('click', init);

init();

function init() {
    currentBet = 0;
    board = [];
    playerHand = [];
    dealerHand =[];
    playerTotal = 0;
    dealerTotal = 0;
    winner = null;
    turn =playerHand;
    render();
}

function render() {
    generateBoard();
    clearBoard();
    renderMessages();
    renderControls();
}

function generateBoard() {
    for (let i = 0; i <4; i++) {
     for(let j = 0; j < VALUES.length; j++) {
     board.push(COLORS[i]+VALUES[j]);
     }
    }
 }

function clearBoard() {
    for(let i = 1; i <= 6; i++){
        const dealerCard = document.getElementById(`dealer-${i}`);
        dealerCard.className = "card large back-blue shadow";
    }
    for(let i = 1; i <= 6; i++){
        const playerCard = document.getElementById(`player-${i}`);
        playerCard.className = "card large back-blue shadow";
    }
}

function renderMessages(info) {
    if (info === 'win'){
        messageEl.textContent = 'You win!';
    } else if (info === 'lose') {
        messageEl.textContent = 'You lose!';
    } else if (info === 'push') {
        messageEl.textContent = 'It\'s a push!';
    } else if (info === 'shuffled') {
        messageEl.textContent = 'Out of chips! Shuffling the deck... '
    } else if (info === 'fund') {
        messageEl.textContent = 'Not enough funds!'
    } else if (info === 'bet')  {
        messageEl.textContent = 'Place a bet!'
    }  
}

function renderControls() {
    messageEl.textContent = '';
    document.querySelector('#bet').disabled = false;
    document.querySelector('#hit').disabled = true;
    document.querySelector('#stand').disabled = true;
    document.querySelector('#deal').disabled = false;
}

function disableButtons () {
    document.querySelector('#bet').disabled = true;
    document.querySelector('#hit').disabled = true;
    document.querySelector('#stand').disabled = true;
    document.querySelector('#deal').disabled = true;
}

function resetGame() {
    currentBet = 0;
    currentChips = 100;
    board = [];
    playerHand = [];
    dealerHand =[];
    playerTotal = 0;
    dealerTotal = 0;
    winner = null;
    turn =playerHand;
    betVal.innerHTML = currentBet;
    chipsVal.innerHTML = `Chips:${currentChips}`;
    render();
}

function bet() {
    if(currentChips >= 10){
       currentChips -= 10;
       currentBet += 10;
       betVal.innerHTML = currentBet;
       chipsVal.innerHTML = `Chips:${currentChips}`;
    } else {
        renderMessages('fund');
    }
}

function drawCard() {
    const cardIdx = Math.floor(Math.random() * 52);
    const newCard = board[cardIdx]; 
    const card = {
        card:newCard,
        number: newCard.slice(1),
        color: newCard.charAt(0)
    }; 
    return card; 
} 

function renderCard(card, role, roleNum) {
    const playerHandContainer = document.querySelector(`#${role}-${roleNum}`);
    const newHtml = document.createElement("div");
    newHtml.id = `${role}-${roleNum}`;
    newHtml.className = `card large ${card.card} shadow animate__animated animate__flipInY`;
    playerHandContainer.replaceWith(newHtml);
}

function deal() {
    const playerCard1 = drawCard(); 
    playerHand.push(playerCard1);
    renderCard(playerCard1,'player', playerHand.length);
    const playerCard2 = drawCard(); 
    playerHand.push(playerCard2);
    renderCard(playerCard2,'player', playerHand.length);
    const dealerCard1 = drawCard();  
    dealerHand.push(dealerCard1);
    renderCard(dealerCard1,'dealer', dealerHand.length);
    if(checkBlackjack(playerHand)) {
        win();
    }    
    document.querySelector('#bet').disabled = true;
    document.querySelector('#deal').disabled = true;
    document.querySelector('#hit').disabled = false;
    document.querySelector('#stand').disabled = false;
    }

function stand() {
    turn = dealerHand; 
    while(checkTotal(dealerHand) < 17) {
        const card = drawCard();  
        dealerHand.push(card);
        renderCard(card, 'dealer', dealerHand.length);
    }
    dealerTotal =checkTotal(dealerHand);
    playerTotal = checkTotal(playerHand);
    if (dealerTotal > 21) {
        win();
    } else if (dealerTotal === 21) {
        lose();
    } else if (playerTotal > dealerTotal){
        win();
    } else if (playerTotal === dealerTotal) {
        push();
    } else lose();
    if(currentChips === 0) {
        setTimeout(() => {
            renderMessages('shuffled');
        }, 2000);
        setTimeout(() => {
            resetGame();
        }, 3000);
    } 
}

function hit(event) {
    const cardIdx = Math.floor(Math.random() * 52);
    const newCard = board[cardIdx];
    const card = {
     card:newCard,
     number: newCard.slice(1),
     color: newCard.charAt(0)
    }; 
    playerHand.push(card);
    renderCard(card, 'player', playerHand.length);
    playerTotal = checkTotal(playerHand);
    if (playerTotal > 21) {
        lose();
    } 
    if (playerTotal === 21) {
        win();
    } 
}

function checkBlackjack(hand) {
    if (hand.length < 3) {
        const cardAce = hand.find((card)=>{
            return card.number === 'A';
        });
        const cardQkj = hand.find((card)=>{
            return card.number === 'J'|| card.number === 'Q'|| card.number === 'K';
        });
           
        if (cardAce !== undefined && cardQkj !== undefined) {
            return 21;
        }
    }   
}

function checkTotal (hand) {
    if(checkBlackjack(hand)) return 21;
    const total = hand.reduce((accumulator, card)=>{
       let number ;
       if (card.number === 'A') 
            number = 1;
       else if (card.number ==='J'|| card.number=== 'Q'|| card.number === 'K')
            number =10;  
       else 
            number = parseInt(card.number);
       return accumulator + number;
    },0);
    return total;
}

function win() {
    currentChips=currentChips+currentBet*2;
    currentBet = 0;
    betVal.innerHTML = currentBet;
    chipsVal.innerHTML = `chips:${currentChips}`;
    disableButtons();
    renderMessages('win');
}

function lose() {
    currentBet = 0;
    betVal.innerHTML = currentBet;
    chipsVal.innerHTML = `chips:${currentChips}`;
    disableButtons();
    renderMessages('lose');
}

function push() {
    currentChips = currentChips + currentBet;
    currentBet = 0;
    betVal.innerHTML = currentBet;
    chipsVal.innerHTML = `chips:${currentChips}`;
    disableButtons();
    renderMessages('push');
}
