const hRollDis = document.querySelector("#h-roll");
const pRollDis = document.querySelector("#p-roll");
const vRollDis = document.querySelector("#v-roll");

const hDecDis = document.querySelector("#h-dec");
const pDecDis = document.querySelector("#p-dec");
const vDecDis = document.querySelector("#v-dec");

const hPointsDis = document.querySelector("#h-points");
const pPointsDis = document.querySelector("#p-points");
const vPointsHDis = document.querySelector("#v-points-h");
const vPointsPDis = document.querySelector("#v-points-p");

const hHPDis = document.querySelector("#h-hp");
const pHPDis = document.querySelector("#p-hp");
const vHPDis = document.querySelector("#v-hp");

const hWinsDis = document.querySelector("#h-wins");
const pWinsDis = document.querySelector("#p-wins");
const vWinsDis = document.querySelector("#v-wins");

const buttonContainer = document.querySelector("#button-container");
const gameButton = document.querySelector("#game-button");

let gameStep = 0;
let fullReset = true;
gameButton.addEventListener("click", function (){
    //Reset game button
    if (gameStep == 0) {
        if (fullReset) {
            const resetGame = document.createElement("button");
            resetGame.id = "reset-game";
            resetGame.textContent = "Reset Game";
            resetGame.addEventListener ("click", function (){
                hWins = 0;
                pWins = 0;
                vWins = 0;
                gameReset();
                resetGame.remove();
                gameButton.textContent = "Start Game";
                gameStep = 0;
                fullReset = true;
            })
            buttonContainer.appendChild(resetGame);
        };
        getHChoice();
        getPChoice();
        getVChoice();
        gameStep = 2;
        gameButton.textContent = "Show Rolls";
    }
    //Start game, get choices
    else if (gameStep == 1) {
        roundReset();
        if (hAlive) {
            getHChoice();
        }
        if (pAlive) {
            getPChoice();
        }
            getVChoice();
        gameStep = 2;
        gameButton.textContent = "Show Rolls";
    }
    //Get rolls
    else if (gameStep == 2) {
        vRoll = diceRollInt();
        hRoll = diceRollInt();
        getHScore();
        pRoll = diceRollInt();
        getPScore();
        getVScore();
        if (hAlive) {  
            hRollDis.textContent = hRoll;
        }
        if (pAlive) {
            pRollDis.textContent = pRoll;
        }
        vRollDis.textContent = vRoll;
        gameStep = 3;
        gameButton.textContent = "Reveal Decision";
    }
    //Decisions, scores
    else if (gameStep == 3) {
        getResults();
        if (hAlive) {
            if (!pAlive) {
                hDecSum = "You have no advantage";
            }
            hDecDis.textContent = hDecSum;
            hPointsDis.textContent = `${hScore} [${hResult}]`;
            vPointsHDis.textContent = `${vHeroScore} [${vHeroResult}]`;
        }
        if (pAlive) {
            if (!hAlive) {
                pDecSum = "You have no advantage";
            }
            pDecDis.textContent = pDecSum;
            pPointsDis.textContent = `${pScore}${pChoiceNote} [${pResult}]`;
            vPointsPDis.textContent = `${vPrincessScore} [${vPrincessResult}]`;
        }
        vDecDis.textContent = vDecSum;
        gameStep = 4;
        gameButton.textContent = "Accept Fate";
    } else if (gameStep == 4) {
        calculateFinal();
        if (hAlive) {
            hHPDis.textContent = hHP;
        }
        if (pAlive) {
            pHPDis.textContent = pHP;
        }
        vHPDis.textContent = vHP;
        gameStep = 1;
        gameButton.textContent = "Next Round";
    }
})

let hAlive = true;
let pAlive = true;
let vAlive = true;
let hChoice;
let pChoice;
let pChoiceNote = "";
let vChoice;
let hRoll;
let pRoll;
let vRoll;
let hScore;
let pScore;
let vHeroScore;
let vPrincessScore;
let hGuess;
let hDecSum;
let pDecSum;
let vDecSum;
let hResult;
let pResult;
let vHeroResult;
let vPrincessResult;
let hHP = 5;
let pHP = 5;
let vHP = 5;
let hWins = 0;
let pWins = 0;
let vWins = 0;

function roundReset() {
    hRollDis.textContent = "";
    pRollDis.textContent = "";
    vRollDis.textContent = "";
    hDecDis.textContent = "";
    pDecDis.textContent = "";
    vDecDis.textContent = "";
    hPointsDis.textContent = "";
    pPointsDis.textContent = "";
    vPointsHDis.textContent = "";
    vPointsPDis.textContent = "";
}
function gameReset() {
    roundReset();
    hAlive = true;
    pAlive = true;
    vAlive = true;
    hHP = 5;
    pHP = 5;
    vHP = 5;
    hHPDis.textContent = hHP;
    pHPDis.textContent = pHP;
    vHPDis.textContent = vHP;
    hWinsDis.textContent = hWins;
    pWinsDis.textContent = pWins;
    vWinsDis.textContent = vWins;
}

function getHChoice() {
    if (hAlive) {
        if (pAlive) {
            let hPrompt = "Hero, enter 0 for Princess to keep all her points, or 1-6 to guess Villain's roll for an automatic round win.";
            hChoice = prompt(hPrompt);
            while (hChoice !== "0" && hChoice !== "1" && hChoice !== "2" && hChoice !== "3" && hChoice !== "4" && hChoice !== "5" && hChoice !== "6") {
                alert("Invalid input, please choose 0 or a number 1-6");
                hChoice = prompt(hPrompt);
            }
        } else if (!pAlive) {
            alert ("Hero, you will now face the Villain without the help of the Princess");
            hChoice = 0;
        }
    }
}
function getPChoice() {
    if (pAlive) {
        if (hAlive) {
            let pPrompt = "Princess, would you like to give up your advantage in a tie to add potential points to the Hero's roll? Yes: 1, No: 2";
            pChoice = prompt(pPrompt);
            while (pChoice !== "1" && pChoice !== "2") {
                alert("Invalid input, please choose 1 for yes and 2 for no");
                pChoice = prompt(pPrompt);
            }
            if (pChoice == 2) {
                pChoiceNote = "*"
            }
        } else if (!hAlive) {
            alert ("Princess, you will now face the Villain without the protection of the Hero");
            pChoice = 2; //Hero dies, princess keeps advantage
            pChoiceNote = ""
        }
    } 
}
function getVChoice() {
    if (hAlive && pAlive) {
        let vPrompt = "Villain, who do you want focus your attack on, the Hero: 1, or Princess: 2? (+1 and block from giving other player advantage: Hero letting Princess have extra point, Princess adding points to Hero's roll)";
        vChoice = prompt(vPrompt);
        while (vChoice !== "1" && vChoice !== "2") {
            alert("Invalid input, please choose 1 for Hero and 2 for Princess");
            vChoice = prompt(vPrompt);
        }
    } else if (!hAlive) {
        alert ("Villain, you are now focusing your attack on the Princess, with the two extra points gained from defeating the Hero")
        vChoice = 2;
    } else if (!pAlive) {
        alert ("Villain, you are now focusing your attack on the Hero, with one extra point from defeating the Princess")
        vChoice = 1;
    }
}

function diceRollInt() {
    return Math.floor(Math.random() * 6 + 1);
}
function getHScore (){
    hScore = hRoll;
    //Princess choice
    if (pChoice == "1") {
        let extraHeroPoints = 0;
        if (pRoll == 3 || pRoll == 4) {
            extraHeroPoints = 1;
        } else if (pRoll == 5 || pRoll == 6) {
            extraHeroPoints = 2;
        }
        pDecSum = `Gave up advantage, added ${extraHeroPoints} possible points to Hero's score`
        if (vChoice != "2") {
            hScore = hScore + extraHeroPoints;
        }
    } else {
        pDecSum = "Kept advantage";
    }
    //Hero choice
    if (hChoice != 0) {
        if (hChoice == vRoll) {
            hGuess = true;
            hDecSum = `Subtracted extra point from Princess, guessed correctly (${vRoll})`;
        } else {
            hGuess = false;
            hDecSum = `Subtracted extra point from Princess, guessed wrong (${hChoice})`;
        }
    } else  {
        hDecSum = `Tried to allow Princess to keep extra point`
        hGuess = false;
    }
}
function getPScore() {
    pScore = pRoll + 1;
    if (hChoice != 0 || vChoice == 1) {
        pScore = pScore - 1;
    }
}
function getVScore() {
    vHeroScore = vRoll;
    vPrincessScore = vRoll;
    if (vChoice == 1) {
        vHeroScore = vRoll + 1;
        vDecSum = "Focused attack on Hero"//: +1, stops Hero from letting Princess keep extra point";
    } else {
        vPrincessScore = vRoll + 1;
        vDecSum = "Focused attack on Princess"//: +1, stops Princess from contributing to Hero's score";
    }
    // If only one is alive
    if (!hAlive) {
        vPrincessScore = vRoll + 2;// if hero dies, villain gets those extra two points every round
    }
    if (!pAlive) {
        vHeroScore = vRoll + 1;//if princess dies, villain steals her extra point
    }
    //Calculate villain advantage, reroll draws
    if (hAlive) {
        while (hScore == vHeroScore && !hGuess) {
            hRoll = diceRollInt();
            getHScore();
        }
        if (vHeroScore > hScore && !hGuess) {
            vPrincessScore = vPrincessScore + 2;
        }
    }
    if (pAlive) {
        while  (pScore == vPrincessScore && pChoice == 1) {
            pRoll = diceRollInt();
            getPScore();
        }
    }
}

function getResults() {
    if (hAlive) {
        if (hScore > vHeroScore || hGuess) {
            hResult = "won";
        } else if (hScore < vHeroScore && !hGuess) {
            hResult = "lost";
        }
    }
    if (pAlive) {
        if (pScore > vPrincessScore) {
            pResult = "won";
        }
        if (pScore < vPrincessScore) {
            pResult = "lost";
        }
        if (pChoice == 2) {
            if (pScore == vPrincessScore) {
                pResult = "won";
            }
        }
    }
    //Villain against hero
        if (hResult == "lost") {
            vHeroResult = "won +2";
        } else if (hResult == "won") {
            vHeroResult = "lost";
        }
    //Villain against princess 
        if (pResult == "lost") {
                vPrincessResult = "won";
        } else if (pResult == "won") {
                vPrincessResult = "lost";
        }
}
function calculateFinal() {
    if (hAlive) {
        if (hResult == "lost") {
            hHP--;
            if (hHP <= 0) {
                hAlive = false;
                hChoice = 1;
                hRollDis.textContent = "";
                hDecDis.textContent = "";
                hPointsDis.textContent = "";
                hHPDis.textContent = "0";
            }
        }
    }
    if (pAlive) {
        if (pResult == "lost") {
            pHP--;
            if (pHP <= 0) {
                pAlive = false;
                pChoice = 2;
                pRollDis.textContent = "";
                pDecDis.textContent = "";
                pPointsDis.textContent = "";
                pHPDis.textContent = "0";
            }
        }
    }
    if (vHeroResult == "lost") {
        vHP = vHP - .5;
    }
    if (vPrincessResult == "lost") {
        vHP = vHP - .5;
        if (vHP <= 0) {
                vAlive = false;
        }
    }
    vHP = Math.max (vHP, 0);

    //Calculate wins
    if (hAlive && pAlive && !vAlive) {
        hWins++;
        pWins++;
        alert("The Hero and Princess win this game!");
        winReset();
    }
    if (hAlive && !pAlive && !vAlive) {
        hWins++;
        alert("The Hero wins this game!")
        winReset();
    }
    if (!hAlive && pAlive && !vAlive) {
        pWins++;
        alert("The Princess wins this game!")
        winReset();
    }
    if (!hAlive && !pAlive && vAlive) {
        vWins++;
        alert("The Villain wins this game!")
        winReset();
    }
    if (!hAlive && !pAlive && !vAlive) {
        alert("Everyone died, no one wins")
        winReset();
    }
    function winReset() {
        gameReset();
        gameButton.textContent = "Start Game";
        gameStep = 0;
        fullReset = false;  
    }
}