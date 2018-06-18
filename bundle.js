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
}

class Game{
    constructor(){
        this.board = new Board()
        this.maxplayer = new Player("Ndifreke","X")
        this.minplayer = new Player("Promise","O")
        this.currentplayer = this.maxplayer
        this.history = []
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
}

class Player{
    constructor(name,value){
        this.ai = false
        this.name = name
        this.value = value
    }
}
function checkwin(board,value){
    let combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    
    for (let i of combos){
        if (board.value(i[0]) == value && board.value(i[1]) == value && board.value(i[2]) == value){
            return true
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
exports.Board = Board
exports.score = score
exports.isMoveValid = isMoveValid
exports.checkwin = checkwin
exports.Player = Player
exports.Game = Game

},{}],2:[function(require,module,exports){
 let util = require('./board.js')

 class Game extends util.Game{
     constructor(){
        super()
        let elements = document.getElementsByTagName('td')
        this.elements = elements
        this.notice = document.getElementById("notice")
        this.notice.classList.add("hide")
    }
    
    move(index){
        if (this.isTerminalState()){
            console.log("invalid")
            return false
        }
        if (this.board.move(index,this.currentplayer.value)){
            this.toggle()
            this.elements[index].textContent = this.board.value(index)
            this.checkwin()
        }
        else{
            console.log("invalid")
        }
    }
    checkwin(){
        if (this.isTerminalState()){
            let score = util.score(this)
            let text
            if (score == 10){
                text = this.maxplayer.name + " Has Won"
            }
            else if (score == -10){
                text = this.minplayer.name + " Has Won"
            }
            else{
                text = "Its a draw"
            }
            this.alert(text)
        }
    }
    alert(text){
        this.notice.textContent = text
        this.notice.classList.remove("hide")
    }
    restart(){
        this.board = new util.Board()
        this.notice.classList.add("hide")
        this.redraw()
    }
    redraw(){
        for (let i = 0; i < 9; i++){
            this.elements[i].textContent = this.board.value(i)
        }
    }
}

let g = new Game()
for (let i = 0; i < 9; i++){
    g.elements[i].onclick = () => g.move(i)
}
let el = document.getElementById('r')
r.onclick = () => g.restart()






},{"./board.js":1}]},{},[2]);
