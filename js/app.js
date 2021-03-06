/*
 * Create a list that holds all of your cards
 */
const numberOfCards = 16;
const waitTime = 1350;
const images = ["c1","c2","c3","c4","c5","c6","c7","c8"];

const audioCoin = new Audio('./audio/smw_coin.wav');
const audioPipe = new Audio('./audio/smw_pipe.wav');
const audioKick = new Audio('./audio/smw_kick.wav');
const audioGate = new Audio('./audio/smw_midway_gate.wav');
const audioClear = new Audio('./audio/smw_castle_clear.wav');

let opennedCards = [];
let moveCounter = 0;
let stars = 3;
let running = false;

document.getElementById("restart").addEventListener("click", restart);
document.getElementById("restart-end-container").addEventListener("click", restart);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function updateStars(){

  if((moveCounter<=14)&&(moveCounter>=0)){
    stars = 3;
  }
  else if((moveCounter<=20)&&(moveCounter>14)){
    stars = 2;
  }
  else{
    stars = 1;
  }

  let starBox = document.getElementById("starBoxS");
  starBoxS.innerHTML='';
  for(i=0;i<stars;i++){
    starBoxS.innerHTML +='<li class="fa fa-star"></li>';
  }

}

//show the stars on the screen
function fillStars(){
  updateStars(stars);
  let starBox = document.getElementById("starBox");
  for(i=0;i<stars;i++){
    starBox.innerHTML +='<li><i class="fa fa-star"></i></li>';
  }
}

//clear the stars on the screen
function clearStars(){
  let starBox = document.getElementById("starBox");
  starBox.innerHTML='';
}

//open or hide the victory pop up
function openPopUp(open) {
    let popup = document.getElementById("victoryPopup");
    if(open){
      popup.classList.remove("hide");
      popup.classList.add("show");
    }
    else{
      popup.classList.remove("show");
      popup.classList.add("hide");
    }
}

 //erase the cronometer interval (pause it)
 function eraseInterval(){
  if(running){
    window.clearInterval(interv);
  }
  running = false;
 }

 function testVictory(){
   let cardsRemaining = numberOfCards;

   for(i=0;i<numberOfCards;i++){
      if(table.cards[i].open == true){
        cardsRemaining--;
      }
   }

   if(cardsRemaining == 0){

     audioClear.play();

     if (time.hours < 10) document.getElementById("hoursS").innerHTML = "0" + time.hours + ":"; else document.getElementById("hoursS").innerHTML = time.hours + ":";
     if (time.seconds < 10) document.getElementById("secondsS").innerHTML = "0" + time.seconds; else document.getElementById("secondsS").innerHTML = time.seconds;
     if (time.minutes < 10) document.getElementById("minutesS").innerHTML = "0" + time.minutes + ":"; else document.getElementById("minutesS").innerHTML = time.minutes + ":";

     document.getElementById("movescore").innerHTML = "/ Moves: "+moveCounter

     updateStars(stars);
     fillStars(stars);
     openPopUp(true);
     eraseInterval();

   }
 }

 function restart(){
   let popup = document.getElementById("victoryPopup");

   //unlock the cards
   lockCards(false);
   audioGate.play();
   audioClear.pause();
   audioClear.currentTime = 0;
   openPopUp(false);

   //clear components and variables
   document.getElementById("deck").innerHTML='';
   opennedCards = [];
   moveCounter = -1;
   incrementMove();
   clearStars();
   stars = 3;
   updateStars(stars);

   //clear cronometer
   eraseInterval();
   restartCronometer();

   //close all cards
   for(i=0;i<numberOfCards;i++){
      table.cards[i].open = false;
   }

   //refill the table
   table.fillIn();
 }

 function incrementMove(){
   moveCounter++;
   document.getElementById("moveCounter").innerHTML= moveCounter + " moves";
 }

//lock or unlock the deck preventing user miss click
 function lockCards(lock){
   let cardsElements = document.getElementsByClassName("card");
   for(i=0;i<numberOfCards;i++){
     //Lock
     if(lock){
       cardsElements[i].removeEventListener("click", showCard)
     }
     //Unlock
     else{
       cardsElements[i].addEventListener("click", showCard);
     }
   }
 }

//game main dynamics
 function showCard(){

   if(!running){
     running = true;
     cronometer();
   }

   audioKick.play();

   //create animation and changes the state of the game on screen
   this.classList.remove("pulse");
   this.classList.remove("fadeIn");
   this.firstChild.classList.remove("hidden");
   this.classList.add("open");
   this.classList.add("show");
   this.classList.add("animated");
   this.classList.add("flip");

   //test if the card is open
   if((opennedCards.length == 0)&&(table.cards[this.id].open==false)){
     opennedCards[0] = this.id;
     table.cards[this.id].open = true;
   }
   else if((opennedCards.length == 1)&&(table.cards[this.id].open==false)){
     opennedCards[1] = this.id;
     table.cards[this.id].open = true;

     //Lock the deck
     lockCards(true);

     setTimeout(function() {
       for(i=0;i<opennedCards.length;i++){
         if(table.cards[opennedCards[0]].symbol != table.cards[opennedCards[1]].symbol){
           table.cards[opennedCards[i]].open = false;
           audioPipe.play();
           //create animation and changes the state of the game on screen
           document.getElementById(opennedCards[i]).classList.add('pulse');
           document.getElementById(opennedCards[i]).classList.add('fadeIn');
           document.getElementById(opennedCards[i]).firstChild.classList.add('hidden');
           document.getElementById(opennedCards[i]).classList.remove('open');
           document.getElementById(opennedCards[i]).classList.remove('show');
           document.getElementById(opennedCards[i]).classList.remove('flip');
         }
         else{
           table.cards[opennedCards[i]].open = true;
           audioCoin.play();
           //create animation and changes the state of the game on screen
           document.getElementById(opennedCards[i]).classList.add('match');
           document.getElementById(opennedCards[i]).classList.remove('flip');
           document.getElementById(opennedCards[i]).classList.add('rubberBand');
         }
       }
       //clear the "openned cards" buffer
       opennedCards = [];

       //Unlock the deck
       lockCards(false);
       incrementMove();
       console.log("before"+stars);
       updateStars();
       console.log("after"+stars);
       testVictory();

     }, waitTime);
   }
 }

 //table class
 let Table = function(size){
     let obj = Object.create(Table.prototype);
     obj.size = size;
     obj.cards = new Array();
     obj.deck = document.getElementById("deck");
     return obj;
 }
 //fill the table with new cards
 Table.prototype.fillIn = function(){

   let imagesArray = [];

   for(i=0;i<(this.size/2);i++){
     imagesArray[i]=images[i];
     imagesArray[i+(this.size/2)]=images[i];
   }

   imagesArray = shuffle(imagesArray);

   for(i=0;i<this.size;i++){
     this.cards[i] = Card(imagesArray[i]);
     document.getElementById("deck").innerHTML+='<li class="card" id="'+i+'"><i class="box hidden '+imagesArray[i]+'"></i></li>';
   }

   let cardsElements = document.getElementsByClassName("card");

   for(i=0;i<this.size;i++){
     cardsElements[i].addEventListener("click", showCard);
   }
 }

//card class
let Card = function(symbol){
    let obj = Object.create(Card.prototype);
    obj.open = false;
    obj.symbol = symbol;
    return obj;
}

let time = {
  'seconds': 0,
  'minutes': 0,
  'hours': 0,
}

function restartCronometer(){
  time.seconds = 0;
  time.minutes = 0;
  time.hours = 0;

  updateCronometer();
}

function updateCronometer(){
  if (time.seconds == 60) { time.minutes++; time.seconds = 0; }
  if (time.minutes == 60) { time.hours++; time.seconds = 0; time.minutes = 0; }
  if (time.hours < 10) document.getElementById("hours").innerHTML = "0" + time.hours + ":"; else document.getElementById("hours").innerHTML = time.hours + ":";
  if (time.seconds < 10) document.getElementById("seconds").innerHTML = "0" + time.seconds; else document.getElementById("seconds").innerHTML = time.seconds;
  if (time.minutes < 10) document.getElementById("minutes").innerHTML = "0" + time.minutes + ":"; else document.getElementById("minutes").innerHTML = time.minutes + ":";
}

function cronometer(){
  interv = window.setInterval(function() {
        updateCronometer();
        time.seconds++;
    },1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 audioCoin.load;
 audioPipe.load;
 audioKick.load;
 audioGate.load;
 audioClear.load;

 let table = Table(numberOfCards);
 table.fillIn();
 updateStars(stars);
