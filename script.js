/**
 * Global variables.
 */
var playerSeq = new Array();
var seqSounds;
var sameSequence = true;
var indexPlayerSeq;
var level = 2;

/**
 * Simon game program.
 */
$(document).ready(function () {
    init();
});

/**
 * Initialize a game.
 */
function init() {
    $(".level").text("Click here to begin");
    $(".pad").prop("disabled", true);
    $(".pad").css("cursor", "auto");
    $(".circle").prop("disabled", false);
    $(".circle").css("cursor", "pointer");
}

/**
 * Begin a game.
 */
$(".circle").on("click", function () {
    if (!$(".circle").prop("disabled")) {
        playerSeq.length = 0;

        $(".level").text("Level : " + level);

        showLevel(level);

        $(".circle").prop("disabled", true);
        $(".circle").css("cursor", "auto");
    }
});

/**
 * Click on the pads manually.
 */
$(".pad").on("click", function () {
    var getPad = this.className;
    var nbPad = parseInt(getPad.substr(getPad.length - 1));

    // reset of a player sequence when a level is done
    if (playerSeq.length == 0) {
        indexPlayerSeq = 0;
    }

    // pads not disabled
    if (!$(".pad").prop("disabled")) {
        switch (nbPad) {
            case 1:
                $(".sound1").get(0).play();
                playerSeq.push($(".sound1").get(0));
                checkLevelWin(playerSeq, indexPlayerSeq);
                break;
            case 2:
                $(".sound2").get(0).play();
                playerSeq.push($(".sound2").get(0));
                checkLevelWin(playerSeq, indexPlayerSeq);
                break;
            case 3:
                $(".sound3").get(0).play();
                playerSeq.push($(".sound3").get(0));
                checkLevelWin(playerSeq, indexPlayerSeq);
                break;
            case 4:
                $(".sound4").get(0).play();
                playerSeq.push($(".sound4").get(0));
                checkLevelWin(playerSeq, indexPlayerSeq);
                break;
            default:
                break;
        }
    }
});

/**
 * Create a random integer between two numbers.
 * 
 * @param {*} min minimum boundary
 * @param {*} max maximum boundary
 * @returns the random integer
 */
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generate a sequence of numbers of the given level.
 * 
 * @param {*} level level impacting the sequence
 * @returns the sequence of numbers
 */
function generateSequence(level) {
    var nbPads = new Array();

    while (nbPads.length != level) {
        var nbPadToClick = randomIntFromInterval(1, 4);
        nbPads.push(nbPadToClick);
    }

    return nbPads;
}

/**
 * Create the sounds sequence which corresponds with the sequence of numbers.
 * 
 * @param {*} seq sequence of numbers
 * @returns the sounds sequence
 */
function createSoundSequence(seq) {
    var nbSounds = new Array();

    for (var i = 0; i < seq.length; ++i) {    
        nbSounds.push($(".sound" + seq[i]).get(0));
    }

    return nbSounds;
}

/**
 * Get the pads sequence which corresponds to the sequence of numbers.
 * 
 * @param {*} seq sequence of numbers
 * @returns the pads sequence
 */
function getPadsSequence(seq) {
    var pads = new Array();

    for (var i = 0; i < seq.length; ++i) {    
        pads.push($(".pad.shape" + seq[i]));
    }

    return pads;
}

/**
 * Play the audios of the sound sequence.
 * 
 * @param {*} delay delay between two sounds
 * @param {*} seqSounds sequence of sounds
 * @param {*} seqPads sequence of pads
 */
function playSoundSequence(delay, seqSounds, seqPads) {
    seqSounds.forEach((sound, index) => {
        seqPads.forEach((pad, index) => {
            setTimeout(() => {
                pad.fadeTo("fast", 1, function() {});
            }, delay * ++index)
        });

        setTimeout(() => {
            sound.play();
        }, delay * ++index)
    });
}

/**
 * Enable the player to play the game after showing a level.
 * 
 * @param {*} delay delay between two opacity animations
 * @param {*} seqPads sequence of pads
 */
function backToInitialState(delay, seqPads) {
    seqPads.forEach((pad, index) => {
        setTimeout(() => {
            pad.fadeTo("fast", pad.css("opacity"), function() {
                // enable pads when last fadeOut is finished
                if (index == seqPads.length - 1) { 
                    $(".pad").prop("disabled", false);
                    $(".pad").css("cursor", "pointer");
                }

                $(".pad").removeAttr("style");
            });
        }, delay * ++index)
    });
}

/**
 * Show the pads sequence to the player.
 * 
 * @param {*} level level impacting the demonstration
 */
function showLevel(level) {
    $(".level").text("Level : " + level);

    $(".pad").prop("disabled", true);
    $(".pad").css("cursor", "auto");

    var delay = 1000;
    var seq = generateSequence(level);
    seqSounds = createSoundSequence(seq);
    var seqPads = getPadsSequence(seq);

    playSoundSequence(delay, seqSounds, seqPads);
    backToInitialState(delay, seqPads);
}

/**
 * Trigger if a player makes a mistake.
 */
function loseGame() {
    var delay = 2000

    playerSeq.length = 0;

    $(".level").text("You loose");

    $(".pad").prop("disabled", true);
    $(".pad").css("cursor", "auto");

    setTimeout(() => {
        showLevel(level)
    }, delay)
}

/**
 * Check if the player has won.
 * 
 * @param {*} playerSeq sequence of sounds pressed by the player
 */
function checkLevelWin(playerSeq) {
    if (playerSeq[indexPlayerSeq] != seqSounds[indexPlayerSeq]) {
        sameSequence = false;
    } else {
        sameSequence = true;
    }

    if (!sameSequence){
        loseGame();
    }

    if (sameSequence && indexPlayerSeq == seqSounds.length - 1) {
        playerSeq.length = 0;

        ++level;
        $(".level").text("Level : " + level);

        showLevel(level);
    }

    ++indexPlayerSeq;
}