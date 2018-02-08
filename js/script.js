var deckCount = 1;
var cardArray = [];
var cardCount = 0;
var moveCount = 0;
var player = 0;
var playerActiveCards = [];
var dealerActiveCards = [];
var playerTotal = 0;
var dealerTotal = 0;
var dealerCardImageUrl = null;

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
	  	if (acc[0] && curVal[0]) {
	  		acc = acc[0];
	  		curVal = curVal[0]
	  		return acc + curVal;
	  	} else if (curVal[0]) {
	    	curVal = curVal[0];
	  		return acc + curVal;
	  	} else if (acc[0]) {
	  		acc = acc[0];
	    	return acc + curVal;
	  	} else {
	  		return acc + curVal;
	  	}
	});
	
	total = sum;
	
	if (sum > 21) {
	  	var secondSum = arr.reduce(function(acc, curVal) {
	    	if (acc[0] && curVal[0]) {
	  			acc = acc[1];
	  			curVal = curVal[1]
	  			return acc + curVal;
	  		} else if (curVal[0]) {
	   	 		curVal = curVal[1];
	  			return acc + curVal;
	  		} else if (acc[0]) {
	  			acc = acc[1];
	   	 		return acc + curVal;
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

	if (playerActiveCards[1]) {
		playerTotal = countTotal(playerActiveCards);
	} else if (playerActiveCards[0]) {
		playerTotal = playerActiveCards[0];
	} else {
		playerTotal = 0;
	};

	if (player === 2) {
		if (dealerActiveCards[1]) {
			dealerTotal = countTotal(dealerActiveCards);
			$('#dealerscorebox').text(' | Dealer: ' + dealerTotal);
		}
	} else {
			$('#dealerscorebox').text('');
		};


	$('#playerscorebox').text('Player: ' + playerTotal);
};
//---------------------------------------------------

var checkForBust = function () {
	if (playerTotal > 21) {
	$('#playerscorebox').text('Player: BUST!');
	endHand();
	}
	if (dealerTotal > 21) {
	$('#dealerscorebox').text(' | Dealer: BUST!');
	endHand();
	}
};

var stand = function () {
	player = 2;
	displayScore();
	dealerPlays();
};
//--------------------------------------------------------

var dealerPlays = function () {
	if (player === 1) {
	if (moveCount === 1) {
		var dealerCard = $("<img>");
		dealerCard.attr('src', 'img/card_back.svg').addClass("upsidedowncard").appendTo('#dealercards');
		dealerCardImageUrl = cardArray[cardCount].images.svg
		dealerActiveCards.push(cardArray[cardCount].numericalValue);
		moveCount++;
		cardCount++;
		player = 0;
	} 
	if (moveCount === 3) {
		var dealerCard = $("<img>");
		dealerCard.attr('src', cardArray[cardCount].images.svg).addClass("cards").appendTo('#dealercards');
		dealerActiveCards.push(cardArray[cardCount].numericalValue);
		moveCount++;
		cardCount++;
		player = 0;
	}
	}

	if (player === 2) {
		$('.upsidedowncard').attr('src', dealerCardImageUrl);
		setTimeout( function () {
			$('.upsidedowncard').toggleClass('cards').toggleClass('upsidedowncard');
		}, 5);

		var dealThrough = setInterval(function() {
			if (dealerTotal >= 17) {
				checkForBust();
				endHand();
				clearInterval(dealThrough);
			} else if (dealerTotal < 17) {
				var dealerCard = $("<img>");
				dealerCard.attr('src', cardArray[cardCount].images.svg).addClass("cards").appendTo('#dealercards');
				dealerActiveCards.push(cardArray[cardCount].numericalValue);
				displayScore();
				checkForBust();
				moveCount++;
				cardCount++;	
			}
		}, 500);
		
		////finish dealer AI to automatically play out
	}
};

//----------------------------------------------------------------------------------------------------

var dealToPlayer = function () {
  if (player === 0) {
	if (moveCount === 0 || moveCount === 2) {
		var playerCard = $("<img>");
		playerCard.attr('src', cardArray[cardCount].images.svg).addClass("cards").appendTo('#playercards');
		playerActiveCards.push(cardArray[cardCount].numericalValue);
		moveCount++;
		cardCount++;
		player = 1;
		displayScore();
	} else {
		var playerCard = $("<img>");
		playerCard.attr('src', cardArray[cardCount].images.svg).addClass("cards").appendTo('#playercards');
		playerActiveCards.push(cardArray[cardCount].numericalValue);
		displayScore();
		moveCount++;
		cardCount++;
		checkForBust();
	}
}
}; 





var dealInitialCards = function () {

	dealToPlayer();
	dealerPlays();
	dealToPlayer();
	dealerPlays();
	$('#hitbutton').on('click', dealToPlayer);
	$('#standbutton').on('click', stand);

	//add event listeners for for hit/stand
	//after stand dealerPlays();
	

};

var nextHand = function () {
	$('#nexthandbutton').toggle().off();
	moveCount = 0;
	player = 0;
	playerActiveCards = [];
	dealerActiveCards = [];
	playerTotal = 0;
	dealerTotal = 0;
	dealerCardImageUrl = null;
	$('#dealercards').empty();
	$('#playercards').empty();
	displayScore();

	$('#dealbutton').toggle().on('click', function () {
			dealInitialCards();
			$('#dealbutton').toggle().off();
	});
};


var endHand = function() {
	$('#hitbutton').off();
	$('#standbutton').off();
	$('#nexthandbutton').toggle().on('click', nextHand);
};





var startGame = function () {

	$('#startbutton').toggle();
	$('#resetbutton').toggle();
	$('#standbutton').toggle();
	$('#hitbutton').toggle();
	$('#dealbutton').toggle();

	$('#dealbutton').on('click', function () {
			dealInitialCards();
			$('#dealbutton').toggle().off();
	});
};






$(document).ready(function () {

	getCards();
	$('#startbutton').click(startGame);
	$('#resetbutton').click(function() {
		location.reload();
	});
});