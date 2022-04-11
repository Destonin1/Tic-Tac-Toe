const winCond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const Player = (setSign) => {
    let sign = setSign;
    return {sign}
}

const aiPlayer = (setSign) => {
    let sign = setSign;

    function getEmptySquares(squares) {
        let indexes = [];
        for(i = 0; i < squares.length; i++)
            if (squares[i] === null)
                indexes.push(i);
        return indexes;
        
    }

    function getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    function  getEmptySquare(squares) {
        const emptySquares = getEmptySquares(squares);
        const emptySquaresIndex = getRandomNumber(emptySquares.length);
        return emptySquares[emptySquaresIndex]; 
    }

    function aiMoveRandom(squares) {
        return getEmptySquare(squares);
    }

    function bestMove(squares, aiSign, playerSign) {
        const emptySlots = getEmptySquares(squares);

        for(let i = 0; i < emptySlots.length; i++){
            if(checkOnWin(squares,emptySlots[i], aiSign) !== null){
                return emptySlots[i];
            }
        }
        for(let i = 0; i < emptySlots.length; i++){
            if(checkOnWin(squares,emptySlots[i], playerSign) !== null){
                return emptySlots[i];
            }
        }

        const angleMoveIndex = angleMove(squares);
        if(angleMoveIndex !== null) {
            return angleMoveIndex
        }
        return null
    }

    function checkOnWin(squares, move, sign) {
        let _squares = squares.slice();
        _squares[move] = sign;

          for(let i = 0; i < winCond.length; i++) {
            const [a, b, c] = winCond[i];
            if(_squares[a] && _squares[a] === _squares[b] && _squares[a] === _squares[c]) {
                return move
            }
        }
        return null
    }

    function angleMove(squares) {
        let angleIndexes = [];
        if(squares[4] === null) {
            return 4
        }
        for(i = 0; i < squares.length; i += 2){
            if (squares[i] === null){
                angleIndexes.push(i);
            }
        }
        if(angleIndexes !== null){
            const move = getRandomNumber(angleIndexes.length);
            return angleIndexes[move];
        }
        return null
    }

    return {sign, aiMoveRandom, bestMove}
}

const Board = () => {

    function turn(squares, choice, sign) {
        squares[choice] = sign;
        document.querySelector('.square[data-id="' + choice + '"').innerHTML = sign;
        
        if(isWin(squares)) {
            return "win"
        }
        if(isDraw(squares)){
            return "draw"
            
        }
        return "nothing"
    }

    function isEmptySquare(squares, i) {
        if(squares[i] === null){
            return true
        }
        else return false
    }

    function isWin(squares) {
          for(let i = 0; i < winCond.length; i++) {
            const [a, b, c] = winCond[i];
            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
    }

    function isDraw (squares) {
        if(squares.includes(null)){
            return false
        }
        else return true
    }

    return {turn, isEmptySquare}
}

const Game = () => {
    let squares;
    let xIsNext;
    let isGameEnd;
    const Player1 = Player("X");
    const aiPlayer1 = aiPlayer("O");
    let GameBoard;

    function initialize() { 
        squares = Array(9).fill(null)
        GameBoard = Board(squares);
        xIsNext = true;
        isGameEnd = false;
        createBoard();
    }

    function startMove(square,sign){
        const result = GameBoard.turn(squares, square, sign);
        let nextTurn = false;
        switch (result) {
            case 'win':
                endGame(sign)
                break
            case "draw":
                endGame(null)
                break
            case "nothing":
                nextTurn = true
                break
        } 
        return nextTurn
    } 

    function playerMove(square){
        if(GameBoard.isEmptySquare(squares, square) && !isGameEnd) {
            let nextTurn = startMove(square,Player1.sign);
            if(nextTurn){
                setTimeout(aiMove, 100);
            }
        }
    }

    function aiMove() {
        let aiChoice = aiPlayer1.bestMove(squares, aiPlayer1.sign, Player1.sign)
        if(aiChoice == null){
            aiChoice = aiPlayer1.aiMoveRandom(squares);
        }
        startMove(aiChoice,aiPlayer1.sign);
    }

    function endGame(winnerSign){
        isGameEnd = true;
        const boardWrap = document.getElementById("board-wrap");

        const winnerText = document.createElement('div');
        winnerText.classList.add('winner-text');

        const startButton = document.createElement('div');
        startButton.classList.add('btn-wrap');
        startButton.insertAdjacentHTML('beforeEnd','<button class="new-btn" onclick="Start()">Start new game</button>');

        if(winnerSign !== null){ 
            winnerText.insertAdjacentHTML('beforeEnd', 'The winner is ' + winnerSign);
            boardWrap.appendChild(winnerText);
        }
        else {
            winnerText.insertAdjacentHTML('beforeEnd', 'It is a draw!');
            boardWrap.appendChild(winnerText);
        }
        boardWrap.appendChild(startButton);
    }

    function createBoard() {
        const boardWrap = document.getElementById("board-wrap");
        boardWrap.innerHTML = '';
        
        const squares = document.createElement('div');
        squares.classList.add('board');
        for(let i = 0; i < 9; i++){
            const p = '<div class="square" data-id="' + i + '" onclick="GameObj.playerMove(' + i + ')"></div>'
            squares.insertAdjacentHTML('beforeEnd', p)
        }
        boardWrap.appendChild(squares);
    }
    return {playerMove, initialize}
}

const GameObj = Game();

function Start() {
    GameObj.initialize();
};