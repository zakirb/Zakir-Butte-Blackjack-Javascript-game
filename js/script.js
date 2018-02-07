var deckCount = 1;
var cardArray = [];
var dealCount = 0;
var player = 0

var getCards = function () {$.get('https://deckofcardsapi.com/api/deck/new/draw/?count=' + (deckCount * 52).toString()).done(function(data) {
    cardArray = data.cards;
    //creates numerical value for each object in array
    cardArray.forEach(function (item) {
    	if (item.value === "JACK" || item.value === "QUEEN" || item.value === "KING") {
    		item.numericalValue = 10;
    	} else if (item.value === "ACE") {
    		item.numericalValue = [11, 1];
    	} else {
    		item.numericalValue = parseInt(item.value);
    	}
    });
})};


var dealCards = function () {
	//if player 0, deal to dealer box
	////add image to card box
	//create array of values for each card box
	///dealerTotalArray //playerTotalArray

};

var totalCount = function () {
	//playerActiveCardArray.reduce(total, curVal) for sum
	//checkFor21
};






var startGame = function () {

	$('#startbutton').toggleClass('hide');
	$('#resetbutton').toggleClass('hide');
	$('#shufflebutton').toggleClass('hide');
	$('#dealbutton').toggleClass('hide');


	$('#dealbutton').click(function () {
		for (i = 0; i < 7; i++) {
		var dealerCard = $("<img>");
		dealerCard.attr('src', cardArray[i].images.svg).addClass("cards");
		$('#dealercards').append(dealerCard)
		}
	});

	$('#dealbutton').click(function () {
		for (i = 9; i < 16; i++) {
		var playerCard = $("<img>");
		playerCard.attr('src', cardArray[i].images.svg).addClass("cards").appendTo('#playercards');
		// $('#playercards').append(playerCard)
		}
	});

	// var dealerCard2 = $("<img>");
	// dealerCard2.attr('src', cardArray[1].images.svg).addClass("cards");
};








$(document).ready(function () {

	getCards();
	$('#startbutton').click(startGame);
	$('#resetbutton').click(function() {
		location.reload();
	});
});