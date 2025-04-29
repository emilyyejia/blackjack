/*----- constants -----*/
const COLORS = ['d','h','s','c'];
const VALUES = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
 
/*----- state variables -----*/
let board;
let playerHand;
let dealerHand;
let currentBet;
let turn;
let winner;
let playerTotal;
let dealerTotal;
let currentChips = 100;

/*----- cached elements  -----*/
const betVal = document.querySelector('#betVal');
const chipsVal= document.querySelector('#chips');
const messageEl = document.querySelector('#message');
/*----- event listeners -----*/
document.querySelector('#bet').addEventListener('click',bet);
document.querySelector('#hit').addEventListener('click',hit);
document.querySelector('#stand').addEventListener('click',stand);
document.querySelector('#deal').addEventListener('click', deal);
document.querySelector('#continue').addEventListener('click', init);


/*----- functions -----*/
init();
// The init function is to initialize all state, then call render()
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
function renderControls() {
    messageEl.textContent = '';
    document.querySelector('#bet').disabled = false;
    document.querySelector('#hit').disabled = false;
    document.querySelector('#stand').disabled = false;
    document.querySelector('#deal').disabled = false;
  

}
function renderMessages(result) {
    if (result === 'win'){
        messageEl.textContent = 'You win!';
    } else if (result === 'lose') {
        messageEl.textContent = 'You lose!';
    } else if (result === 'push') {
        messageEl.textContent = 'It\'s a push!';
    } 
   
}

function generateBoard() {
    for (let i = 0; i <4; i++) {
     for(let j = 0; j < VALUES.length; j++) {
     board.push(COLORS[i]+VALUES[j]);
     }
    }
 }
function clearBoard() {
    for(let i = 1; i <= 5; i++){
        const dealerCard = document.getElementById(`dealer-${i}`);
        dealerCard.className = "card large back-blue shadow";
    }
    for(let i = 1; i <= 5; i++){
        const playerCard = document.getElementById(`player-${i}`);
        playerCard.className = "card large back-blue shadow";
    }

}
function bet(event) {
  if(currentChips >= 10){
   currentChips -= 10;
   currentBet += 10;
   betVal.innerHTML = currentBet;
   chipsVal.innerHTML = `chips:${currentChips}`;
  } else alert("No enough funds!")
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

function deal() {
    const playerCard1 = drawCard(); 
    playerHand.push(playerCard1);
    const playerHandContainer = document.querySelector("#player-" + playerHand.length);
    const newHtml = document.createElement("div");
    newHtml.id = "player-" + playerHand.length;
    newHtml.className = `card large ${playerCard1.card} shadow`;
    playerHandContainer.replaceWith(newHtml);
    const playerCard2 = drawCard(); 
    playerHand.push(playerCard2);
    const playerHandContainer2 = document.querySelector("#player-" + playerHand.length);
    const newHtml2 = document.createElement("div");
    newHtml2.id = "player-" + playerHand.length;
    newHtml2.className = `card large ${playerCard2.card} shadow`;
    playerHandContainer2.replaceWith(newHtml2);
    const dealerCard1 = drawCard();  
    dealerHand.push(dealerCard1);
    const DealerHandContainer = document.querySelector("#dealer-" + dealerHand.length);
    const newHtml1 = document.createElement("div");
    newHtml1.id = "dealer-" + dealerHand.length;
    newHtml1.className = `card large ${dealerCard1.card} shadow`;
    DealerHandContainer.replaceWith(newHtml1);
    if(checkBlackjack(playerHand))
        return 21;
    }

function stand() {
    turn = dealerHand; 
    while(checkTotal(dealerHand) < 17) {
    const card = drawCard();  
    dealerHand.push(card);
    const DealerHandContainer = document.querySelector("#dealer-" + dealerHand.length);
    const newHtml1 = document.createElement("div");
    newHtml1.id = "dealer-" + dealerHand.length;
    newHtml1.className = `card large ${card.card} shadow`;
    DealerHandContainer.replaceWith(newHtml1);
    }
    dealerTotal =checkTotal(dealerHand);
    playerTotal = checkTotal(playerHand);
    console.log('dealer:'+dealerTotal);
    console.log('player:'+ playerTotal)
    if (dealerTotal > 21) {
        win();
    } else if (dealerTotal === 21) {
        lose();
    } else if (playerTotal > dealerTotal){
        win();
    } else if (playerTotal === dealerTotal) {
        push();
    } else lose();
    
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
    const playerHandContainer = document.querySelector("#player-" + playerHand.length);
    const newHtml = document.createElement("div");
    newHtml.id = "player-" + playerHand.length;
    newHtml.className = `card large ${card.card} shadow`;
    playerHandContainer.replaceWith(newHtml);
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
if(checkBlackjack(hand))
    return 21;
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

function disableButtons () {
    document.querySelector('#bet').disabled = true;
    document.querySelector('#hit').disabled = true;
    document.querySelector('#stand').disabled = true;
    document.querySelector('#deal').disabled = true;

}
