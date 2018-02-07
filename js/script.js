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


$('#dealbutton').click(function () {
	for (i = 0; i < 2; i++) {
	var dealerCard = $("<img>");
	dealerCard.attr('src', cardArray[i].images.svg).addClass("cards");
	$('#dealercards').append(dealerCard)
	}
});

$('#dealbutton').click(function () {
	for (i = 9; i < 11; i++) {
	var playerCard = $("<img>");
	playerCard.attr('src', cardArray[i].images.svg).addClass("cards");
	$('#playercards').append(playerCard)
	}
});

	// var dealerCard2 = $("<img>");
	// dealerCard2.attr('src', cardArray[1].images.svg).addClass("cards");
	
	
	
	



};








$(document).ready(function () {

	$('#startbutton').click(startGame);
getCards();
	$('#resetbutton').click(function() {
		location.reload();
	});
});