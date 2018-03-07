/*
 * Create a list that holds all of your cards
 */
const numberOfCards = 16;
const images = ["fa fa-diamond","fa fa-paper-plane-o","fa fa-anchor","fa fa-bolt","fa fa-cube","fa fa-bicycle","fa fa-bomb","fa fa-leaf"];

let opennedCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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


 function showCard(){
   this.classList.add("open");
   this.classList.add("show");

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
           document.getElementById(opennedCards[i]).classList.remove('open');
           document.getElementById(opennedCards[i]).classList.remove('show');
         }
         else{
           table.cards[opennedCards[i]].open = true;
           document.getElementById(opennedCards[i]).classList.add('match');
         }
       }
       opennedCards = [];

       //Unlock the deck
       lockCards(false);

     }, 1000);
   }
 }

 let Table = function(size){
     let obj = Object.create(Table.prototype);
     obj.size = size;
     obj.cards = new Array();
     obj.deck = document.getElementById("deck");
     return obj;
 }
 Table.prototype.fillIn = function(){

   let imagesArray = [];

   for(i=0;i<(this.size/2);i++){
     imagesArray[i]=images[i];
     imagesArray[i+(this.size/2)]=images[i];
   }

   imagesArray = shuffle(imagesArray);

   for(i=0;i<this.size;i++){
     this.cards[i] = Card(imagesArray[i]);
     document.getElementById("deck").innerHTML+='<li class="card" id="'+i+'"><i class="'+imagesArray[i]+'"></i></li>';
   }

   let cardsElements = document.getElementsByClassName("card");

   for(i=0;i<this.size;i++){
     cardsElements[i].addEventListener("click", showCard);
   }
 }

let Card = function(symbol){
    let obj = Object.create(Card.prototype);
    obj.open = false;
    obj.symbol = symbol;
    return obj;
}

let table = Table(numberOfCards);
table.fillIn();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        //Object.
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
