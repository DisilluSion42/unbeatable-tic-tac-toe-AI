const { commands } = require('./screen');

class ComputerPlayer {

  static getValidMoves(grid) {

    const numOfRows = grid.length;
    const numOfCols = grid[0].length;
    let validMoves = [];

    for(let i = 0; i < numOfRows; i++) {

      for(let j = 0; j < numOfCols; j++) {

        if(grid[i][j] === ' ') validMoves.push({row : i, col : j});

      }

    }

    return validMoves;

  }

  static randomMove(grid) {

    let validMoves = this.getValidMoves(grid);

    if(validMoves.length === 1) return validMoves[0];
    let rand = Math.floor(Math.random() * validMoves.length);

    return {row : validMoves[rand].row, col : validMoves[rand].col};

  }

  static checkWin(grid, symbol) {

    const TTT = require('./ttt');

    const check = TTT.checkWin(grid);

    if(check === symbol) return true;

    return false;

  }

  static copyGrid(grid) {

    let copy = [];

    for(let row = 0; row < grid.length; row++) {

      copy.push(grid[row].slice());

    }

    return copy;

  }

  static countSymbol(grid, symbol) {
    let count = 0;

    for(let row = 0; row < grid.length; row++) {

      for(let col = 0; col < grid[row].length; col ++) {

        if(grid[row][col] === symbol) count ++;

      }

    }

    return count;
  }

  static winNow(grid, symbol) {

    return ComputerPlayer.checkWin(grid, symbol);

  }

  static getWinningMoves(grid, symbol) {

    const validMoves = ComputerPlayer.getValidMoves(grid); // get all valid moves
    let winningMoves = [];

    for(let i = 0; i < validMoves.length; i++) {

      const validMove = validMoves[i];
      let copy = ComputerPlayer.copyGrid(grid); // temporary copy

      // If there is a move to win immediately, do it
      copy[validMove.row][validMove.col] = symbol;

      if(ComputerPlayer.winNow(copy, symbol))
      winningMoves.push({row: validMove.row, col: validMove.col});

    }

    return winningMoves;

  }

  static getBlockingMoves(grid, symbol) {

    const oppoSymbol = symbol === 'X' ? 'O' : 'X'; // get opponent's symbol
    const validMoves = ComputerPlayer.getValidMoves(grid); // get all valid moves
    let blockingMoves = [];

    for(let i = 0; i < validMoves.length; i++) {

      const validMove = validMoves[i];
      let copy = ComputerPlayer.copyGrid(grid); // temporary copy

      // If opponent is gonna make a move to win immediately, block it
      copy[validMove.row][validMove.col] = oppoSymbol;

      if(ComputerPlayer.winNow(copy, oppoSymbol))
      blockingMoves.push({row: validMove.row, col: validMove.col});

      // let nextWinMoves =

    }

    return blockingMoves;

  }

  // static getCorners(grid, symbol) {

  //   const oppoSymbol = symbol === 'X' ? 'O' : 'X'; // get opponent's symbol
  //   const corners = [{row: 0, col: 0}, {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2}];
  //   let blankCorners = [];
  //   let copy = ComputerPlayer.copyGrid(grid);

  //   for(let i = 0; i < corners.length; i++) {

  //     const corner = copy[corners[i].row][corners[i].col];

  //     if(ComputerPlayer.countSymbol(grid, oppoSymbol) === 1 && copy[1][1] === ' ')
  //     return {row: 1, col: 1}; // if opponent owns a corner, block center

  //     if(corner === ' ') blankCorners.push(corners[i]);

  //   }

  //   const predictiveMoves = ComputerPlayer.getPredictiveMove(copy, symbol);

  //   for(let j = 0; j < blankCorners.length; j++) {

  //     const blankCorner = copy[blankCorners[j].row][blankCorners[j].col];

  //     if(ComputerPlayer.countSymbol(copy, symbol) === 0 || predictiveMoves.includes(blankCorner))
  //     return blankCorners[j];

  //   }

  //   return null;
  // }

  static getCorner(grid) {

    const corners = [{row: 0, col: 0}, {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2}];

    for(let i = 0; i < corners.length; i++) {

      if(grid[corners[i].row][corners[i].col] === ' ')
      return corners[i];

    }

  }

  static blockTrap(grid, symbol) {

    const oppoSymbol = symbol === 'X' ? 'O' : 'X';

    // If go after to the second move
    if(ComputerPlayer.countSymbol(grid, symbol) === 1 &&
    ComputerPlayer.countSymbol(grid, oppoSymbol) === 2) {

      // and AI symbol at center
      if(grid[1][1] === symbol) {

        // and two player symbols at diagonal corners
        if((grid[0][0] === oppoSymbol && grid[2][2] === oppoSymbol) ||
        (grid[0][2] === oppoSymbol && grid[2][0] === oppoSymbol))

        return {row: 0, col: 1};

      }

    }

    const validMoves = ComputerPlayer.getValidMoves(grid);

    for(let i = 0; i < validMoves.length; i++) {

      let copy = ComputerPlayer.copyGrid(grid);

      const validMove = validMoves[i];
      const validRow = validMove.row;
      const validCol = validMove.col;

      copy[validRow][validCol] = oppoSymbol;

      const winningMoves = ComputerPlayer.getWinningMoves(copy, oppoSymbol); // get opponent's possible winning moves

      if(winningMoves.length >= 2) return validMove;

    }

    return null;

  }

  static getPredictiveMove(grid, symbol) {

    const validMoves = ComputerPlayer.getValidMoves(grid); // get all valid moves
    const predictiveMoves = [];

    for(let i = 0; i < validMoves.length; i++) {

      const validMove = validMoves[i];
      const row = validMove.row;
      const col = validMove.col;
      const down = row === 0 ? 0 : row - 1;
      const up = row === 2 ? 2 : row + 1;
      const left = col === 0 ? 0 : col - 1;
      const right = col === 2 ? 2 : col + 1;

      let copy = ComputerPlayer.copyGrid(grid); // temporary copy
      copy[validMove.row][validMove.col] = symbol;

      // if the move can make a potential win move, do it
      const nextWinMoves = ComputerPlayer.getWinningMoves(copy, symbol);
      if(nextWinMoves.length > 0){

        const adjacent = [grid[up][col], grid[down][col], grid[row][left], grid[row][right]];

        if(adjacent.includes(symbol)) predictiveMoves.push(validMove);

      }

    }

    return predictiveMoves;

  }

  static getSmartMove(grid, symbol) {

    const oppoSymbol = symbol === 'X' ? 'O' : 'X';

    // If go first, get the corner
    if(ComputerPlayer.countSymbol(grid, symbol) === 0 &&
    ComputerPlayer.countSymbol(grid, oppoSymbol) === 0) return {row: 0, col: 0};

    // If go after, get the center
    if(ComputerPlayer.countSymbol(grid, symbol) === 0 &&
    ComputerPlayer.countSymbol(grid, oppoSymbol) === 1)
    return grid[1][1] === 'O' ? {row: 0, col: 0} : {row: 1, col: 1};

    // If go first to the second move, get another corner
    if(ComputerPlayer.countSymbol(grid, symbol) === 1 &&
    ComputerPlayer.countSymbol(grid, oppoSymbol) === 1) return ComputerPlayer.getCorner(grid);

    // If go after to the second move
    // if(ComputerPlayer.countSymbol(grid, symbol) === 1 &&
    // ComputerPlayer.countSymbol(grid, oppoSymbol) === 2) {

    //   // first block
    //   const blockingMoves = ComputerPlayer.getBlockingMoves(grid, symbol);

    //   if(blockingMoves.length > 0) return blockingMoves[0];

    //   // if no block needed, predictive move
    //   const predictiveMoves = ComputerPlayer.getPredictiveMove(grid, symbol);

    //   if(predictiveMoves.length > 0) return predictiveMoves[0];

    // }

    const winningMoves = ComputerPlayer.getWinningMoves(grid, symbol);

    if(winningMoves.length > 0) return winningMoves[0];

    const blockingMoves = ComputerPlayer.getBlockingMoves(grid, symbol);

    if(blockingMoves.length > 0) return blockingMoves[0];

    if(ComputerPlayer.countSymbol(grid, oppoSymbol) >= 2) {

      const blockTrapMoves = ComputerPlayer.blockTrap(grid, symbol);

      if(blockTrapMoves) return blockTrapMoves;

    }

    const predictiveMoves = ComputerPlayer.getPredictiveMove(grid, symbol);

    if(predictiveMoves.length > 0) return predictiveMoves[0];

    // for(let i = 0; i < predictiveMoves.length; i++) {

    //   const predictiveMove = predictiveMoves[i];

    //   if(predictiveMove)
    // }

    return ComputerPlayer.randomMove(grid);

  }

}

// let grid = [['O',' ',' '],
//               [' ','X',' '],
//               [' ','O',' ']];

// // console.log([grid[3][3]].includes(1));

// debugger
// console.log(ComputerPlayer.blockTrap(grid, 'X'));

module.exports = ComputerPlayer;
