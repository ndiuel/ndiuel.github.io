(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class Board{
    constructor(){
        this.cells = [" "," "," "," "," "," "," "," "," "]
    }

    draw(){
        for (let i of [0,3,6]){
            if (i==3 || i==6){
                console.log("-----------")
            }
            console.log(" " + this.cells[i] + " | " + this.cells[i+1] + " | " + this.cells[i+2] )

        }
    }

    move(index,value){
        if (isMoveValid(index,this)){
            this.cells[index] = value
            return true

        }
        return false
    }

    cellIsEmpty(index){
        return this.cells[index] == " "
    }

    value(index){
        if (index < 9){
            return this.cells[index]
        }
        return false
    }
    
    isBoardEmpty(){
        let empty = 0
        for (let i of this.cells){
            if ( i == " "){
                empty++
            }
        }
        return empty == 9
    }

    isBoardFull(){
        let full = 0
        for (let i of this.cells){
            if (i != " "){
                full++
            }
        }
        return full == 9
    }

    freespaces(){
        let arr = []
        for (let i of range(9)){
            if (this.cellIsEmpty(i)){
                arr.push(i)
            }
        }
        return arr
    }
}

class Game{
    constructor(mode='single'){
        this.mode = mode
        this.board = new Board()
        this.history = []
        this.winningCombo = []
        this.init()
    }

    assignCombo(){
        if (!this.isTerminalState() || score(this) == 0){
            return false
        }
        this.toggle()
        this.winningCombo = checkwin(this.board,this.currentplayer.value)
        this.toggle()
        return true
    }

    init(){
        if (this.mode == 'single'){
            this.maxplayer = new Player(this,"Player","X",false)
            this.minplayer = new Player(this,"Computer","O",true)
        }
        else{
            this.maxplayer = new Player(this,'Player1',"X",false)
            this.minplayer = new Player(this,'Player2',"O",false)
        }
        this.currentplayer = this.maxplayer
        this.currentplayerHasPlayed = false
    }

    toggle(){
        if (this.currentplayer == this.maxplayer){
            this.currentplayer = this.minplayer
        }
        else{
            this.currentplayer = this.maxplayer
        }
    }

    isTerminalState(){
        if (this.board.isBoardFull()){
            return true
        }
        if (score(this) != 0){
            return true
        }
        return false
    }

    move(index){
        if (this.isTerminalState()){
            return false
        }
        if (this.currentplayer.move(index)){
            this.history.push(index)
            this.toggle()
            return true
        }
        else{
            return false
        }
    }

    simulate(log=true){
        while (!this.isTerminalState()){
            let move = aimove(this.board)
            this.move(move)
            if (log){
                this.board.draw()
                console.log(" ")
            }

        }
        this.assignCombo()
    }
    undo(){
        if (this.isTerminalState() || this.mode == 'single'){
            return false
        }
        let last = this.history.pop()
        if (last){
            this.board.cells[last] = " "
            this.toggle()
            return true
        }        
    }
    restart(){
        this.board = new Board()
        this.history = []
    }
    reset(){
        this.restart()
        this.maxplayer.empty()
        this.minplayer.empty()
    }
}

class Player{
    constructor(game,name,value,ai=false){
        this.ai = ai
        this.name = name
        this.value = value
        this.score = 0
        this.game = game
    }

    move(index){
        return this.game.board.move(index,this.value)
    }

    increase(){
        this.score+=1
    }

    decrease(){
        if (this.score > 0){
            this.score-=1
        }
    }

    empty(){
        this.score = 0
    }        
}

function checkwin(board,value){
    let combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    
    for (let i of combos){
        if (board.value(i[0]) == value && board.value(i[1]) == value && board.value(i[2]) == value){
            return i
        }
    }
    return false

}

function isMoveValid(index,board){
    return index < 9 && board.cellIsEmpty(index)
}

function score(game){
    if (checkwin(game.board,game.maxplayer.value)){
        return 10
    }
    else if (checkwin(game.board,game.minplayer.value)){
        return -10
    }
    else{
        return 0
    }
}

function choice(arr){
    return arr[Math.floor(Math.random() * arr.length )]
}

function range(min,max){
    if (!min && !max){
        return false
    }
    let arr = []   
    if (min && max){
        for (let i = min; i < max; i++){
            arr.push(i)
        }
        return arr
    }
    let num
    if (min) {num = min} else{num = max}
    for (let i = 0; i < num; i++){
        arr.push(i)
    }
    return arr
}

function aimove(board){
    return choice(board.freespaces())
}

exports.Board = Board
exports.score = score
exports.isMoveValid = isMoveValid
exports.checkwin = checkwin
exports.Player = Player
exports.Game = Game
exports.aimove = aimove



},{}],2:[function(require,module,exports){
let logic = require('./board.js')
let boardCells = document.getElementsByTagName('td')
let mode = document.getElementById('mode').getElementsByTagName('p')
let modeBtn = mode[0]
let modeText = mode[1]
let notice = document.getElementById('notice').firstChild
let names = document.getElementsByClassName('player')
let scores = document.getElementsByClassName('score')
let firstPlayerName = names[0]
let firstPlayerScore = scores[0]
let secondPlayerName = names[1]
let secondPlayerScore = scores[1]
let controls = document.getElementById('control').getElementsByClassName('btn')
let restartBtn = controls[0]
let undoBtn = controls[1]
let resetBtn = controls[2]
let games = []
let currentGame
let created = new CustomEvent('start')
let someone = new CustomEvent('played')

function notify(){
    let text 
    if (!currentGame.isTerminalState()){
        text = " "
    }
    else{
       let score = logic.score(currentGame)
       if (score == 10){
           text = currentGame.maxplayer.name + " Has Won" 
           currentGame.maxplayer.increase()
           firstPlayerScore.textContent = currentGame.maxplayer.score
        }
        else if (score == -10){
            text = currentGame.minplayer.name + " Has Won"
            currentGame.minplayer.increase()
            secondPlayerScore.textContent = currentGame.minplayer.score
        }
        else{
            text = "It's a draw"
        }
   }
    notice.textContent = text
}

function render(){
    firstPlayerName.textContent = currentGame.maxplayer.name
    firstPlayerScore.textContent = currentGame.maxplayer.score
    secondPlayerScore.textContent = currentGame.minplayer.score
    secondPlayerName.textContent = currentGame.minplayer.name
    modeText.textContent = currentGame.mode.toUpperCase() + " PLAYER"
    drawBoard()
}

function drawBoard(){
    for (let i = 0; i < 9; i++){ 
        boardCells[i].textContent = currentGame.board.value(i)
    }
}   

function aimove(){
    if (currentGame.currentplayer.ai){
        let move = logic.aimove(currentGame.board)
        console.log(move)
        if (typeof(move) == "number"){
            if (currentGame.move(move)){
                boardCells[move].textContent = currentGame.board.value(move)
                notify()
            }
        }
    }
}
function getGame(mode='single'){
    for (let game of games){
        if (game.mode == mode){
            currentGame = game
            window.dispatchEvent(created)
            return true
        }
    }  
    game = new logic.Game(mode)
    games.push(game)
    currentGame = game
    window.dispatchEvent(created)
    return true
}
modeBtn.onclick = function(){
    if (currentGame.mode == 'single'){
        getGame('multi')
    }
    else if (currentGame.mode == 'multi'){
        getGame('single')
    }
    notify()
}

resetBtn.onclick = function(){
    notice.textContent = " "
    currentGame.reset()
    window.dispatchEvent(created)
}

restartBtn.onclick = function(){
    notice.textContent = " "
    currentGame.restart()
    window.dispatchEvent(created)
}

undoBtn.onclick = function(){
    if (currentGame.undo()){
        console.log('yes')
        drawBoard()
    }
}

for (let i = 0; i < 9; i++){
    boardCells[i].onclick = function(){
        if (currentGame.move(i)){
            boardCells[i].textContent = currentGame.board.value(i)
            window.dispatchEvent(someone)
        }
    }
}

window.addEventListener('start',function(){
    render()
    aimove()
})
window.addEventListener('played',function(){
    if (currentGame.isTerminalState()){
        console.log('yes')
        notify()
        return
    }
    if (currentGame.currentplayer.ai){
        aimove()
    }  
})

getGame()

},{"./board.js":1}]},{},[2]);
