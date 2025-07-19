// DOM Elements
const homeScreen = document.querySelector(".home-screen");
const gameScreen = document.querySelector(".game-screen");
const cells = document.querySelectorAll(".cells");
const msg = document.querySelector(".msg");
const resetGameButton = document.querySelector(".reset");
const homeButton = document.querySelector(".home");
const themeButton = document.querySelector(".theme");
const musicButton = document.querySelector(".music");

// Game State
let gameMode = "multi";
let gameOver = false;
let turnO = true;
let turnCount = 0;

// Music
const audio = new Audio("https://eta.vgmtreasurechest.com/soundtracks/pokemon-black-and-white-super-music-collection/hhrvqtky/2-02.%20Driftveil%20City.mp3");
audio.loop = true;

// Utility
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const winConditions = [
    [0,1,2], [0,3,6], [0,4,8],
    [1,4,7], [2,5,8], [2,4,6],
    [3,4,5], [6,7,8]
];

// Start Game
function startGame(mode) {
    gameMode = mode;
    homeScreen.style.display = "none";
    gameScreen.style.display = "block";
    resetGame();
}

// Reset Game
function resetGame() {
    gameOver = false;
    turnO = false;
    turnCount = 0;
    resetGameButton.innerText = "Reset Game";
    msg.style.textDecoration = "none";
    msg.innerText = gameMode === "multi" ? "Player X's Turn" : "Player's Turn";

    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("win", "O", "X");
        cell.style.pointerEvents = "auto";
        cell.disabled = false;
    });
}

// Handle Cell Click
cells.forEach(cell => {
    cell.addEventListener("click", async () => {
        if (cell.innerText || gameOver) return;

        if (gameMode === "multi") {
            playerMove(cell);
        } else if (!turnO) {
            msg.innerText = "Player's Turn";
            playerMove(cell);
            disableButtons();

            if (!gameOver && turnCount < 9) {
                msg.innerText = "Computer's Turn";
                await wait(400);
                computerMove();
                enableButtons();
            }
        }
    });
});

// Player Move
function playerMove(cell) {
    const currentPlayer = turnO ? "O" : "X";
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer);
    cell.style.pointerEvents = "none";
    cell.disabled = true;

    turnO = !turnO;
    turnCount++;

    msg.innerText = gameMode === "multi"
        ? `Player ${turnO ? "X" : "O"}'s Turn`
        : "Player's Turn";

    checkWinner();
}

// Computer Move
const computerMove = ()=>{
    // 1. Try to win
    for(let i = 0 ; i<cells.length ; i++){
        if(cells[i].innerText ===""){
            cells[i].innerText = "O";
            if(checkResult()==="O"){
                finalizeMove(i);
                return;
            }
            cells[i].innerText = "";
        }
    }

    // 2. Try to block Player's Win
     for(let i = 0 ; i<cells.length ; i++){
        if(cells[i].innerText ===""){
            cells[i].innerText = "X";
            if(checkResult()==="X"){
                finalizeMove(i);
                return;
            }
            cells[i].innerText = "";
        }
    }

    // 3. Take Center
    if(cells[4].innerText === ""){
        finalizeMove(4);
        return;
    }

    // 4. Take a Corner 
    const corners = [0,2,6,8];
    const availableCorners = corners.filter(i =>cells[i].innerText === "" );
    if(availableCorners.length > 0){
        const randomCorner = availableCorners[Math.floor(Math.random()*availableCorners.length)];
        finalizeMove(randomCorner);
        return;
    }

    // 5. Pick any available cells
    let emptyCells = Array.from(cells).map((c,i) => c.innerText === "" ? i: -1).filter(i => i !== -1);
    if(emptyCells.length > 0){
        let randomCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
        finalizeMove(randomCell);
    }
}

// Finalize Computer Move
function finalizeMove(index) {
    cells[index].innerText = "O";
    cells[index].classList.add("O");
    cells[index].disabled = true;
    turnCount++;
    turnO = false;
    msg.innerText = "Player's Turn";
    checkWinner();
}

// Check Winner
function checkWinner() {
    let winnerFound = false;
    for(let condition of winConditions){

        let pos1val = cells[condition[0]].innerText;
        let pos2val = cells[condition[1]].innerText;
        let pos3val = cells[condition[2]].innerText;

        if( pos1val!="" && pos2val!="" && pos3val!=""){
            if (pos1val===pos2val && pos2val===pos3val && pos3val===pos1val){
                winnerFound = true;
                WinningLine(condition);
                showWinner(pos1val);
                gameOver = true;
            }
        }
    }
    if (turnCount === 9 && winnerFound == false) {
        msg.innerText = "It's a Draw!";
        msg.style.textDecoration = "underline";
        resetGameButton.innerText = "New Game";
        disableButtons();
        gameOver = true;

    }
} 

// Check for Result (Used by AI)
function checkResult() {
    for(let condition of winConditions){

        let pos1val = cells[condition[0]].innerText;
        let pos2val = cells[condition[1]].innerText;
        let pos3val = cells[condition[2]].innerText;

        if(pos1val !== "" && pos1val === pos2val && pos2val ===pos3val){
            return pos1val;
        }
    }

    if(Array.from(cells).every(cell=>cell.innerText !== "")){
        return "draw";
    }

    return null;
}

// UI Helpers
function enableButtons() {
    cells.forEach(cell => {
        cell.style.pointerEvents = "auto";
        cell.disabled = false;
    });
}

function disableButtons() {
    cells.forEach(cell => {
        cell.style.pointerEvents = "none";
        cell.disabled = true;
    });
}

function showWinner(winner) {
    msg.innerText = gameMode === "multi"
        ? `Player ${winner} wins!`
        : "Computer Wins";
    msg.style.textDecoration = "underline";
    resetGameButton.innerText = "New Game";
    disableButtons();
}

const WinningLine = (condition)=>{
    condition.forEach((position)=>{
        cells[position].classList.add("win");
    })
}

// Buttons and Events
resetGameButton.addEventListener("click", resetGame);

homeButton.addEventListener("click", () => {
    homeScreen.style.display = "block";
    gameScreen.style.display = "none";
    resetGame();
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

musicButton.addEventListener("click", () => {
    const musicIcon = musicButton.querySelector("i");
    const isMuted = musicIcon.classList.contains("fa-volume-xmark");

    musicIcon.classList.toggle("fa-volume-xmark", !isMuted);
    musicIcon.classList.toggle("fa-volume-high", isMuted);

    if (isMuted) audio.play();
    else {
        audio.pause();
        audio.currentTime = 0;
    }
});