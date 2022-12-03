const Screen = require("./screen");
const Cursor = require("./cursor");
// const { grid } = require("./screen");
const ComputerPlayer = require('./computer-player');

class TTT {

  constructor() {

    // this.playerTurn = "O";

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']];

    this.cursor = new Cursor(3, 3);


    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);
    this.cursor.setBackgroundColor();

    // Replace this with real commands
    Screen.addCommand('up', 'move cursor up for 1', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move cursor down for 1', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'move cursor left for 1', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move cursor right for 1', this.cursor.right.bind(this.cursor));
    Screen.addCommand('space', 'place a move at current position', this.placeMove.bind(this));

    Screen.setMessage(`Welcome to Tic Tac Toe game!\n
You will be playing with an unbeatable AI, see if you can defeat it! \n
By random generation, you are '${TTT.playerSymbol}', AI is '${TTT.computerSymbol}'.
${TTT.playerSymbol === 'X' ? 'You will make the first move. ' : 'AI has made the first move. YOUR TURN!'} \n`);
    Screen.render();

    if(TTT.computerSymbol === 'X') TTT.cpuPlaceMove();

    Screen.printCommands();
  }

  static playerSymbol = Math.random() > 0.5 ? "X" : "O";
  static computerSymbol = this.playerSymbol === "X" ? "O" : "X";

  static cpuPlaceMove(){
    const cpuMove = ComputerPlayer.getSmartMove(Screen.grid, TTT.computerSymbol);
    Screen.setGrid(cpuMove.row, cpuMove.col, TTT.computerSymbol);
    Screen.setTextColor(cpuMove.row, cpuMove.col, 'red');
    Screen.render();

    const check = TTT.checkWin(Screen.grid);

    if(check !== false) {
      TTT.endGame(check);
    }

  }

  placeMove() {
    if(Screen.grid[this.cursor.row][this.cursor.col] === ' '){
      Screen.setGrid(this.cursor.row, this.cursor.col, TTT.playerSymbol);
      Screen.setTextColor(this.cursor.row, this.cursor.col, 'cyan');
      Screen.render();

      // this.playerTurn = this.playerTurn === 'O' ? 'X' : 'O';
    }

    const check = TTT.checkWin(Screen.grid);

    if(check !== false) {
      TTT.endGame(check);
    }

    TTT.cpuPlaceMove();

  }

  static checkWin(grid) {
    // Check horizontal wins
    function horizontal(xo) {
      for(let row = 0; row < 3; row++) {
        if(grid[row].every(el => el === xo)){
          return true;
        }
      }

      return false;
    }

    // Check vertical wins
    function vertical(xo) {
      for(let col = 0; col < 3; col++) {
        for(let row = 0; row < 3; row++) {
          if(grid[row][col] !== xo){
            break;
          }
          if(row === 2){
            return true;
          }
        }
      }

      return false;
    }

    // Check diagonal wins
    function diagonal(xo) {
      for(let row = 0; row < 3; row++){
        if(grid[row][row] !== xo){
          break;
        }
        if(row === 2){
          return true;
        }
      }

      for(let row = 2; row >= 0; row--){
        if(grid[row][2 - row] !== xo){
          break;
        }
        if(row === 0){
          return true;
        }
      }

      return false;
    }

    function allFilled() {
      for(let row = 0; row < 3; row++) {
        if(grid[row].some(el => el === ' ')) {
          return false;
        }
      }

      return true;
    }
    // Return 'X' if player X wins
    if(horizontal('X') || vertical('X') || diagonal('X')) {
      return 'X';
    }
    // Return 'O' if player O wins
    if(horizontal('O') || vertical('O') || diagonal('O')) {
      return 'O';
    }
    // Return 'T' if the game is a tie
    if(allFilled()) {
      return 'T';
    }
    // Return false if the game has not ended
    return false;
  }

  static endGame(winner) {
    if (winner === TTT.playerSymbol) {
      Screen.setMessage(`Congratulations! You wins! `);
    } else if (winner === TTT.computerSymbol) {
      Screen.setMessage(`Sorry, you lost. `);
    } else if (winner === 'T') {
      Screen.setMessage(`Not bad! Tie game! `);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

// const grid = [[' ',' ',' '], ['O','O','O'], [' ',' ',' ']];

// console.log(TTT.checkWin(grid));

// const grid = [[' ',' ',' '], [' ',' ',' '], [' ',' ',' ']]
// console.log(TTT.checkWin(grid));

module.exports = TTT;
