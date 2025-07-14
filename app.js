let homeScreen = document.querySelector(".home-screen");
let gameScreen = document.querySelector(".game-screen");
let cells = document.querySelectorAll(".cells");
let msg = document.querySelector(".msg");
let msgContainer = document.querySelector(".msg-container");
let resetGameButton = document.querySelector(".reset");
let homeButton = document.querySelector(".home");
let themeButton = document.querySelector(".theme");
let musicButton = document.querySelector(".music");

let gameMode = "multi"; 
let turnO = true; //For player O
let turnCount = 0;
const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
audio.loop =true
const wait = (ms)=> new Promise(resolve => setTimeout(resolve,ms));
const winConditions = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

function startGame(mode) {
    gameMode = mode;
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    resetGame();

    msg.innerText = gameMode === "multi" ? "Player X's Turn" : "Player's Turn";
}


const resetGame = ()=>{
    turnO = false;
    turnCount = 0;
    enableButtons();
    resetGameButton.innerText = "Reset Game";
    msg.style.textDecoration = "none";
    msg.innerText = gameMode === "multi" ? "Player X's Turn" : "Player's Turn";
    for(let cell of cells){
            cell.innerText = "";
            cell.classList.remove("win", "O", "X");
    }
}

cells.forEach((cell) =>{
    cell.addEventListener("click", async ()=>{
        if(cell.innerText != "") return;
        
        if(gameMode == "multi"){
            playerMove(cell);
        }
        else if(gameMode == "single" && !turnO){
            msg.innerText = "Player's Turn";
            playerMove(cell);
            disableButtons();

            if(turnCount < 9){
                msg.innerText = "Computer's Turn";
                await wait(400);
                computerMove();
                enableButtons();
            }
        }

    });
});

const playerMove = (cell)=>{
    if(turnO){
        msg.innerText = gameMode === "multi" ? "Player X's Turn" : "Player's Turn";
        cell.innerText = "O";
        cell.classList.add("O");
        turnO = false;
    }
    else{
        msg.innerText = gameMode === "multi" ? "Player O's Turn" : "Player's Turn";
        cell.innerText = "X";
        cell.classList.add("X");
        turnO = true;
    }
    cell.style.pointerEvents = "none";
    cell.disabled = true;
    turnCount++;
    checkWinner();
};

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

const finalizeMove = (index)=>{
    cells[index].innerText = "O";
    cells[index].classList.add("O");
    cells[index].disabled = true;
    msg.innerText = "Player's Turn";
    turnO = false;
    turnCount++;
    checkWinner();
}

const checkResult = ()=>{

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

const enableButtons = ()=>{
    for(let cell of cells){
        cell.style.pointerEvents = "auto";
        cell.disabled = false;
    }
}

const disableButtons = ()=>{
    for(let cell of cells){
        cell.style.pointerEvents = "none";
        cell.disabled = true;
    }
}

const showWinner = (winner)=>{
    msg.innerText = gameMode === "multi" ? `Player ${winner} wins!` : " Computer Wins";
    msg.style.textDecoration = "underline";
    resetGameButton.innerText = "New Game";
    disableButtons();
}

const WinningLine = (condition)=>{
    condition.forEach((position)=>{
        cells[position].classList.add("win");
    })
}

const checkWinner = ()=>{
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
            }
        }
    }
    if (turnCount === 9 && winnerFound == false) {
        msg.innerText = "It's a Draw!";
        msg.style.textDecoration = "underline";
        resetGameButton.innerText = "New Game";
        disableButtons();
    }
} 

resetGameButton.addEventListener("click", resetGame);

homeButton.addEventListener("click", ()=>{
    homeScreen.style.display = "block";
    gameScreen.style.display = "none";
    resetGame();
});

themeButton.addEventListener("click",()=>{
    
});

musicButton.addEventListener("click",()=>{
    const musicIcon = musicButton.querySelector("i");
    if(musicIcon.classList.contains("fa-volume-xmark")){
        musicIcon.classList.remove("fa-volume-xmark");
        musicIcon.classList.add("fa-volume-high");
        audio.play();
    }
    else{
        musicIcon.classList.remove("fa-volume-high");
        musicIcon.classList.add("fa-volume-xmark");
        audio.pause(); 
        audio.currentTime = 0;
    }
});