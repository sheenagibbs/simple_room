(function ($) {

$(document).ready(function () {

///// Initial State	/////
$("[id$='-dark']").toggle();
$("#girl-container-headbanger1").toggle();
$("#girl-container-headbanger2").toggle();
$("#girl-container-headbanger3").toggle();
$("#girl-container-headbanger4").toggle();
$("#girl-container-headbanger5").toggle();

///// Lavalamp Controls /////
var firstLoad = true;
var lavaBB = lava.getBBox();

var bubbles = ['bubble-1', 'bubble-2', 'bubble-3', 'bubble-4', 'bubble-5', 'bubble-6', 'bubble-7', 'bubble-8'];

setUpBubbles();

function setUpBubbles(){
	for (var i=0; i<bubbles.length; i++){
		var bubbleId = bubbles[i];
		var bubble = $('#'+bubbleId); 

		animateBubble(bubble); // Send it to be infinitely animated
	}
}

function animateBubble(bubble){
	var newTimeline = new TimelineMax();
	var newX = getRandomArbitrary(-lavaBB.width/2, lavaBB.width/2);
	var newY = getRandomArbitrary(-lavaBB.height/2, lavaBB.height/2);
	var newScale = getRandomArbitrary(5, 10);
	var newTime = getRandomArbitrary(5,15);

	if (firstLoad){
		TweenMax.set(bubble, {x: newX, y: newY, scale:newScale});
		newTimeline.to(bubble, newTime, {scale: 0, onComplete:killTimeline});
	} else {
		TweenMax.set(bubble, {x: newX, y: newY});
		newTimeline.to(bubble, newTime, {scale: newScale, ease: Back.easeOut})
			.to(bubble, newTime, {scale: 0, onComplete:killTimeline});
	}



	function killTimeline(){
		firstLoad = false;
		newTimeline.kill();
		animateBubble(bubble);
	}
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
///// Lavalamp Controls :: END /////


///// Light Controls /////
var light = true;
var lampContainer = Snap.select("#lamp-container");
var chain = lampContainer.select("#chain");
var chainDark = lampContainer.select("#chain-dark");

$("#lamp-container").click(function(){
	light = !light;
	
	chain.animate({transform: "t0,30"}, 100, function(){
		chain.animate({transform: "t0,0"}, 1000, mina.elastic);
	});
	chainDark.animate({transform: "t0,30"}, 100, function(){
		chainDark.animate({transform: "t0,0"}, 1000, mina.elastic);
	});

	// Toggle dark versions of elements
	$("[id$='-dark']").toggle();
	// Toggle light cast
	$("#light").toggle();

	if (light){
		$("body").css("background-color", "#492302");
		$("#ground rect#brown").css({fill: "#492302"});
		$("#container").css("background-color", "#6DD6CC");
		$("#lavablur-strength").attr("stdDeviation", "1");
	}
	else {
		$("body").css("background-color", "#040600");
		$("#ground rect#brown").css({fill: "#040600"});
		$("#container").css("background-color", "#000232");
		$("#lavablur-strength").attr("stdDeviation", "25");
	}
});
///// Light Controls :: END /////

///// Boombox Functions /////
var boomboxContainer = Snap.select("#boombox-container");
var tuner = boomboxContainer.select("#tuner");
var tunerDark = boomboxContainer.select("#tuner-dark");
var scanbar = boomboxContainer.select("#scanbar");
var speakerL = boomboxContainer.select("#speaker-L");
var speakerLDark = boomboxContainer.select("#speaker-L-dark");
var speakerLBBox = speakerL.getBBox();
var speakerLCenterX = speakerLBBox.x + (speakerLBBox.width/2);
var speakerLCenterY = speakerLBBox.y + (speakerLBBox.width/2);
var speakerR = boomboxContainer.select("#speaker-R");
var speakerRDark = boomboxContainer.select("#speaker-R-dark");
var speakerRBBox = speakerR.getBBox();
var speakerRCenterX = speakerRBBox.x + (speakerRBBox.width/2);
var speakerRCenterY = speakerRBBox.y + (speakerRBBox.width/2);
var Channel = 0;
var ChannelPos = [0, 20, 40, 75];
// Colors are Grey, Yellow, Green, Red
var bbColours = ["#B1B3B5", "#FFFF00", "#00FF00", "#FF0000"];
var bbSongs  = ["", "light", "medium", "heavy"];
var bbSongTempo = [0, 333, 300, 375];
var bbSongStrength = ["1", "1.05", "1.1", "1.2"];

var sound = new Howl({
  src: ['audio/SimpleRoom_Songs.mp3'],
  sprite: {
  	light: [1000, 10660, true],
  	medium: [13000, 7200, true],
  	heavy: [22000, 6000, true]
  }
});

$("#boombox-container").on("click", boomboxHandler);

function boomboxHandler(){
	// remove event handler to allow animation to take place without conflict
	$("#boombox-container").off("click");
	
	if( Channel < bbColours.length-1 ){
		Channel++;
	} else {
		Channel = 0;
	}
	sound.stop();
	
	scanbar.animate({fill: bbColours[Channel]}, 700);
	tunerDark.animate({transform: "t"+ChannelPos[Channel]+",0"}, 700, mina.easein);
	tuner.animate({transform: "t"+ChannelPos[Channel]+",0"}, 700, mina.easein, function(){
		sound.play(bbSongs[Channel]);

		
		// re-add event after animation takes place
		$("#boombox-container").on("click", boomboxHandler);
		animateSpeakers();
		animateGirl();
	});
}

function animateSpeakers(){
	if (Channel === 0){
		speakerL.animate({transform: leftTransDown}, 100);
		speakerR.animate({transform: rightTransDown}, 100, function(){
			speakerL.stop();
			speakerR.stop();
		});
		
	} else {
		var leftTransUp = "s"+bbSongStrength[Channel]+","+speakerLCenterX+","+speakerLCenterY;
		var leftTransDown = "s1,"+speakerLCenterX+","+speakerLCenterY;
		var rightTransUp = "s"+bbSongStrength[Channel]+","+speakerRCenterX+","+speakerRCenterY;
		var rightTransDown = "s1,"+speakerRCenterX+","+speakerRCenterY;

		// LEFT
		speakerL.animate({transform: leftTransUp}, bbSongTempo[Channel], mina.easeout, function(){
			speakerL.animate({transform: leftTransDown}, bbSongTempo[Channel], mina.easeout);
		});
		// RIGHT
		speakerR.animate({transform: rightTransUp}, bbSongTempo[Channel], mina.easeout, function(){
			speakerR.animate({transform: rightTransDown}, bbSongTempo[Channel], mina.easeout, function(){
				animateSpeakers();
			});
		});
	}

}

function animateGirl(){
	// DANCE PATTERN //
	// trans in  1, 2 
	// dance     3,4,5,4
	// trans out 2, 1
	var transSpeed = 200;
	var sequence = [1, 2, 3, 4, 5, 4];
	var counter = 0;
	var transIn = false;

	$("#girl-container-default").toggle();
	$("#girl-container-headbanger"+sequence[counter]).toggle();
	var loopInterval = setInterval(headbang, transSpeed);

	function headbang(){
		$("#girl-container-headbanger"+sequence[counter]).toggle();
		counter = counter + 1;
		if (counter >= sequence.length){

			counter = 2;
		}
		$("#girl-container-headbanger"+sequence[counter]).toggle();		
	}
}
///// Boombox Functions :: END /////




});

})(jQuery);