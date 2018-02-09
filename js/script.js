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
var playerWin = false;
var dealerWin = false;
var playerBlackjack = false;
var dealerBlackjack = false;
var tieOrPush = false;
var chipTotal = 100;
var currentBet = 0;


//requests new, shuffled 6-deck card object from API, then draws from the same deck and adds to cardArray
var getCards = function () {$.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6').done(function(data) {

	var deckId = data.deck_id;
	var apiSplice1 = 'https://deckofcardsapi.com/api/deck/';
	var apiSplice2 = '/draw/?count=312';

	$.get(apiSplice1 + deckId + apiSplice2).done(function(data) {

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

})})};


////counts total of player or dealer's active/played card array depending on presence of an Ace card
var countTotal = function (arr) {
  var cum = 0;
  arr.forEach(function(item) {
    if (item[0]) {
      if (cum + item[0] > 21) {
        cum = cum + item[1];
      } else {
        cum = cum + item[0];
      }
    } else {
      cum = cum + item
    }
  });
  if (cum > 21) {
    cum = 0;
    arr.forEach(function(item) {
      if (item[0]) {
        cum = cum + item[1];
      } else {
        cum = cum + item;
      }
    });
  } return cum;
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

	dealerTotal = countTotal(dealerActiveCards);
	if (player === 2) {
		if (dealerActiveCards[1]) {
			$('#dealerscorebox').text(' | Dealer: ' + dealerTotal);
		}
	} else {
			$('#dealerscorebox').text('');
		};


	$('#playerscorebox').text('Player: ' + playerTotal);
};
//-----------------------------------------------------

var checkForBlackjack = function () {
	if (playerTotal === 21) {
		playerBlackjack = true;
	}

	if (dealerTotal === 21) {
		dealerBlackjack = true;
	}

};

//---------------------------------------------------

var checkForBust = function () {
	if (playerTotal > 21) {
	$('#playerscorebox').text('Player: BUST!');
	player = 2;
	dealerPlays();
	}
	if (dealerTotal > 21) {
	$('#dealerscorebox').text(' | Dealer: BUST!');
	}
};



//------------------------------------------------------

var stand = function () {
	console.log('STAND');
	$('#hitbutton').off();
	$('#standbutton').off();
	moveCount++;
	player = 2;
	displayScore();
	dealerPlays();
};
//--------------------------------------------------------

var dealerPlays = function () {

	var flipDealerCard = function () {
		$('.upsidedowncard').attr('src', dealerCardImageUrl);
			setTimeout( function () {
				$('.upsidedowncard').toggleClass('cards').toggleClass('upsidedowncard');
			}, 50);
	};

	console.log('Movecount equals: ' + moveCount);
	console.log('DEALER PLAYS');
	if (player === 1) {
	if (moveCount === 1) {
		var dealerCard = $("<img>");
		dealerCard.attr('src', 'img/card_back.svg').addClass("upsidedowncard").appendTo('#dealercards');
		dealerCardImageUrl = cardArray[cardCount].images.svg
		dealerActiveCards.push(cardArray[cardCount].numericalValue);
		console.log(cardArray[cardCount].numericalValue);
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
		checkForBlackjack();

///check for immediate blackjack
		if (playerBlackjack && dealerBlackjack) {
			flipDealerCard();
			tieOrPush = true;
			endHand();
		} else if (playerBlackjack) {
			flipDealerCard();
			playerWin = true;
			endHand();
		} else if (dealerBlackjack) {
			flipDealerCard();
			dealerWin = true;
			endHand();
		} else {
			player = 0;
		}

	}
	}

	if (player === 2 && moveCount > 3) {
		flipDealerCard();
		if (playerTotal>21) {
			endHand();

		}
		if (playerTotal <= 21) {
			var dealThrough = setInterval(function() {
				if (dealerTotal >= 17) {
					endHand();
					checkForBust();
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
		}
	}
};

//----------------------------------------------------------------------------------------------------

var dealToPlayer = function () {
	console.log('Movecount equals: ' + moveCount);
	console.log('DEAL TO PLAYER');
  if (player === 0 && playerTotal != 21) {
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
	disableBetting();
if (cardCount > cardArray.length) {
	console.log('out of cards');
}

	console.log('DEAL INITIAL CARDS');
	dealToPlayer();
	dealerPlays();
	dealToPlayer();
	dealerPlays();
	if (playerWin === false && dealerWin === false){
	$('#hitbutton').on('click', dealToPlayer);
	$('#standbutton').on('click', stand);
	};
};

var nextHand = function () {
	console.log('NEXT HAND');
	refreshBetTable();
	allowBetting();
	$('#nexthandbutton').toggle().off();
	moveCount = 0;
	player = 0;
	playerActiveCards = [];
	dealerActiveCards = [];
	playerTotal = 0;
	dealerTotal = 0;
	dealerCardImageUrl = null;
	playerWin = false;
	dealerWin = false;
	playerBlackjack = false;
	dealerBlackjack = false;
	tieOrPush = false;
	$('#dealercards').empty();
	$('#playercards').empty();
	displayScore();

	$('#dealbutton').toggleClass('hidden').on('click', function () {
			dealInitialCards();
			$('#dealbutton').toggleClass('hidden').off();
	});
};


var endHand = function() {
	console.log('END HAND');
	$('#hitbutton').off();
	$('#standbutton').off();
	$('#nexthandbutton').toggle().on('click', nextHand);

	if (playerTotal <= 21 &&  (playerTotal > dealerTotal || dealerTotal > 21)) {
		playerWin = true;
	}

	if (dealerTotal <= 21 &&  (playerTotal < dealerTotal || playerTotal > 21)) {
		dealerWin = true;
	}

	if (dealerTotal === playerTotal) {
		tieOrPush = true;
	}

	if (playerWin) {
		console.log('you win');
		if (playerBlackjack) {
			console.log('PLAYER BLACKJACK');
			chipTotal += (2.5 * currentBet);
			currentBet = 0;
		} else {
			chipTotal += (2 * currentBet);
			currentBet = 0;
		}
	} else if (tieOrPush) {
		console.log('TIE');
		chipTotal += currentBet;
		currentBet = 0;

	} else if (dealerWin) {
		currentBet = 0
		console.log('you lose');
	}
};


var increaseBet = function() {
	if (chipTotal > 0) {
	currentBet += 10;
	chipTotal -= 10;
	refreshBetTable();
	}
};

var decreaseBet = function() {
	if (currentBet > 0) {
	currentBet -= 10;
	chipTotal += 10;
	refreshBetTable();
	}
};

var refreshBetTable = function () {
	$('#currentbet').text('Bet: $' + currentBet)
	$('#chiptotal').text('Chips: $' + chipTotal)
};

var allowBetting = function () {
	$('#increasebet').on('click', increaseBet);
	$('#decreasebet').on('click', decreaseBet);
};

var disableBetting = function () {
	$('#increasebet').off();
	$('#decreasebet').off();
};



var startGame = function () {

	$('#startbutton').toggle();
	$('#resetbutton').toggle();
	$('#standbutton').toggle();
	$('#hitbutton').toggle();
	$('#dealbutton').toggleClass('hidden');
	allowBetting();
	$('#dealbutton').on('click', function () {
			dealInitialCards();
			$('#dealbutton').toggleClass('hidden').off();
	});
};







$(document).ready(function () {
	getCards();
	refreshBetTable();
	$('#startbutton').click(startGame);
	$('#resetbutton').click(function() {
		location.reload();
	});
});