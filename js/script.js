var deckCount = 1;
var cardArray = [];

var getCards = function () {$.get('https://deckofcardsapi.com/api/deck/new/draw/?count=' + (deckCount * 52).toString()).done(function(data) {
    cardArray = data.cards;
    // console.log(cardArray);
})};



var startGame = function () {

	$('#startbutton').toggleClass('hide');
	$('#resetbutton').toggleClass('hide');
	$('#shufflebutton').toggleClass('hide');
	$('#dealbutton').toggleClass('hide');

	var dealerCard1 = $("<img>");
	dealerCard1.attr('src', cardArray[0].images.png).addClass("cards");

	var dealerCard2 = $("<img>");
	dealerCard2.attr('src', cardArray[1].images.png).addClass("cards");
	
	$('#dealbutton').click(function () {
	$('#dealercards').append(dealerCard1).append(dealerCard2);

});
	



};








$(document).ready(function () {

	$('#startbutton').click(startGame);
getCards();

});