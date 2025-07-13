let homeScreen = document.querySelector(".home-screen");
let gameScreen = document.querySelector(".game-screen");
let cells = document.querySelectorAll(".cells");
let msg = document.querySelector(".msg");
let msgContainer = document.querySelector(".msg-container");
let resetGameButton = document.querySelector(".reset");

let gameMode = "multi"; 
let turnO = true; //For player O
let turnCount = 0;
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
    enableButton();
    resetGameButton.innerText = "Reset Game";
    msg.innerText = gameMode === "multi" ? "Player X's Turn" : "Player's Turn";
}

cells.forEach((cell) =>{
    cell.addEventListener("click",()=>{
        if(cell.innerText != "") return;
        
        if(gameMode == "multi"){
            playerMove(cell);
        }
        else if(gameMode == "single" && !turnO){
            playerMove(cell);

            if(turnCount < 9){
                setTimeout(computerMove,300);
            }
        }

    });
});

const playerMove = (cell)=>{
    if(turnO){
        msg.innerText = "Player X's Turn";
        cell.innerText = "O";
        cell.classList.add("O");
        turnO = false;
    }
    else{
        msg.innerText = "Player O's Turn";
        cell.innerText = "X";
        cell.classList.add("X");
        turnO = true;
    }
    cell.disabled = true;
    turnCount++;
    checkWinner();
};

const enableButton = ()=>{
    for(let cell of cells){
        cell.disabled = false;
        cell.innerText = "";
        cell.classList.remove("win");
        cell.classList.remove("O");
        cell.classList.remove("X");
    }
}

const disableButton = ()=>{
    for(let cell of cells){
        cell.disabled = true;
    }
}

const showWinner = (winner)=>{
    msg.innerText = `Player ${winner} wins!`;
    resetGameButton.innerText = "New Game";
    msgContainer.style.display = "block";
    disableButton();
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
        msgContainer.style.display = "block";
        resetGameButton.classList.add('hide');
        disableButton();
    }
} 

resetGameButton.addEventListener("click", resetGame);