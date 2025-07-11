let buttons = document.querySelectorAll(".button");
let msg = document.querySelector(".msg");
let msgContainer = document.querySelector(".msg-container");
let resetGameButton = document.querySelector(".reset-game");
let newGameButton = document.querySelector(".new-game");

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

const resetGame = ()=>{
    turnO = true;
    turnCount = 0;
    enableButtons();
    msgContainer.classList.add("hide");
    resetGameButton.classList.remove("hide")
}

buttons.forEach((button)=>{
    button.addEventListener('click',()=>{
        if(turnO){
            button.innerText = "O";
            button.classList.add("O");
            turnO = false;
        }
        else{
            button.innerText = "X";
            button.classList.add("X");
            turnO = true;
        }
        button.disabled = true;
        turnCount++;
        checkWinner();
    });
});

const enableButtons = ()=>{
    for(let button of buttons){
        button.disabled = false;
        button.innerText = "";
        button.classList.remove("win");
        button.classList.remove("O");
        button.classList.remove("X");
    }
}

const disableButtons = ()=>{
    for(let button of buttons){
        button.disabled = true;
    }
}

const showWinner = (winner)=>{
    msg.innerText = `Player ${winner} wins!`;
    resetGameButton.classList.add("hide");
    msgContainer.classList.remove("hide");
    disableButtons();
}

const WinningLine = (condition)=>{
    condition.forEach((position)=>{
        buttons[position].classList.add("win");
    })
}

const checkWinner = ()=>{
    let winnerFound = false;
    for(let condition of winConditions){

        let pos1val = buttons[condition[0]].innerText;
        let pos2val = buttons[condition[1]].innerText;
        let pos3val = buttons[condition[2]].innerText;

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
        msgContainer.classList.remove('hide');
        resetGameButton.classList.add('hide');
        disableButtons();
    }
}
newGameButton.addEventListener("click",resetGame);
resetGameButton.addEventListener("click",resetGame);  