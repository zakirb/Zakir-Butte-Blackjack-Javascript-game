var deckCount = 1;
var cardArray = [];
var player = 0;
var playerActiveCards = [];
var dealerActiveCards = [];
var playerTotal = 0;
var dealerTotal = 0;

var getCards = function () {$.get('https://deckofcardsapi.com/api/deck/new/draw/?count=' + (deckCount * 52).toString()).done(function(data) {
    cardArray = data.cards;
    //assigns numerical value instead of a string for each card object in array
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


////counts total of player or dealer's active/played card array depending on presence of an Ace card
var countTotal = function(arr) {
  	var total = 0;
	var sum = arr.reduce(function(acc, curVal){
	  	if (curVal[0]) {
	    	curVal = curVal[0];
	  		return acc + curVal;
	  	} else {
	    	return acc + curVal;
	  	}
	});
	
	total = sum;
	
	if (sum > 21) {
	  	var secondSum = arr.reduce(function(acc, curVal) {
	    	if (curVal[1]) {
	      		curVal = curVal[1];
	      		return acc+ curVal;
	    	} else {
	      		return acc + curVal;
	    	}
	  	});

	  	total = secondSum;
	}

	return total;
};
///------------------------------------------------------------------------------------------------------

var displayScore = function() {
	playerTotal = countTotal(playerActiveCards);
	dealerTotal = countTotal(dealerActiveCards);
};
//---------------------------------------------------






var dealCards = function () {
	//if player 0, deal to dealer box
	////add image to card box
	//create array of values for each card box
	///dealerTotalArray //playerTotalArray

};








var startGame = function () {

	$('#startbutton').toggleClass('hide');
	$('#resetbutton').toggleClass('hide');
	$('#standbutton').toggleClass('hide');
	$('#hitbutton').toggleClass('hide');
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