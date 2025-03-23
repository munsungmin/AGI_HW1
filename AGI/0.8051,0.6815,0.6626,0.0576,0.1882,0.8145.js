// Minimax algorithm implementation (depth 6)
const MAX_DEPTH = 5;
let bestScore = -Infinity;
let bestMove = null;
const ai_player = player; 
const anti_ai_player = (WHITE + BLACK) - ai_player

const weights = [
    [1200, -20, 20, 5, 5, 20, -20, 1200],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [1200, -20, 20, 5, 5, 20, -20, 1200]
];

// ==== 이 아래 파라미터는 자동으로 대체됨 ====
const Gamma0 = 0.8051;
const Gamma1 = 0.6815;
const Gamma2 = 0.6626;
const Gamma3 = 0.0576;
const C2     = 0.1882;
const C3     = 0.8145;
let temp = 0;

function Exp(phi , param) {
    return 1 - Math.exp(-param * phi);
}
function Gaussian(phi, param1 , param2) {
    return Math.exp(-Math.pow(phi - param1, 2) / (2 * Math.pow(param2, 2))); 
}
// Minimax algorithm 
function minimax(board, depth, alpha, beta, maximizingPlayer) {
    
    const player = maximizingPlayer
    const anti_player = (BLACK + WHITE) - player
     // Termination condition
     if (depth === 0) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
         let turn = 0 
         // Board evaluation with 
         let score1 = 0;
         let score2 = temp; 
         let score3 = 0; 

         for (let row = 0; row < BOARD_SIZE; row++) {
             for (let col = 0; col < BOARD_SIZE; col++) {
                 if (board[row][col] === player) {
                     score1 += weights[row][col];
                 } else if (board[row][col] === anti_player) {
                     score1 -= weights[row][col];
                 }
                 if (board[row][col] !== player) continue;

let flag = 1
                for (const [dr, dc] of directions) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (
                        nr >= 0 && nr < BOARD_SIZE &&
                        nc >= 0 && nc < BOARD_SIZE &&
                        board[nr][nc] === EMPTY
                    ) {
                        flag =0
                    }

                }
score3 += flag
                turn += (board[row][col]>0);
             }
         }
         const phi = (turn-4)/60; 
score = Gaussian(phi, Gamma1, 0.6) * score1*10/(turn) +  (1-Exp(phi,Gamma2)) * score2/10 + Exp(phi, Gamma3) * score3;



         return score1; 
     }
     
     // Get valid moves for current player
     const currentValidMoves = [];
     
     for (let row = 0; row < BOARD_SIZE; row++) {
         for (let col = 0; col < BOARD_SIZE; col++) {
             if (isValidMoveForMinimax(board, row, col, player)) {
                 currentValidMoves.push({ row, col });
             }
         }
     }

     // If no valid moves, pass turn to opponent
     if (currentValidMoves.length === 0) {
         // Recursive call with opponent player
         return minimax(board, depth - 1, alpha, beta, anti_player , Gamma1, Gamma2, Gamma3);
     }

     
     if (player == ai_player) {
        
         let maxEval = -Infinity;
         for (const move of currentValidMoves) {
             // Copy the board
             const boardCopy = board.map(row => [...row]);
             
             // Simulate the move
             makeSimulatedMove(boardCopy, move.row, move.col, player);
             if (depth === MAX_DEPTH-1)
             {
                temp = currentValidMoves.length;
             }
             // Recursive evaluation
             const eval = minimax(boardCopy, depth - 1, alpha, beta, anti_player );
             
             maxEval = Math.max(maxEval, eval);
             


             // Alpha-beta pruning
             alpha = Math.max(alpha, eval);
             if (beta <= alpha)
                 break;
         }
         return maxEval;
     } else {
         let minEval = Infinity;
         for (const move of currentValidMoves) {
             // Copy the board
             const boardCopy = board.map(row => [...row]);
             
             // Simulate the move
             makeSimulatedMove(boardCopy, move.row, move.col, player);
             
             // Recursive evaluation
             const eval = minimax(boardCopy, depth - 1, alpha, beta, anti_player);
             minEval = Math.min(minEval, eval);
             
             // Alpha-beta pruning
             beta = Math.min(beta, eval);
             if (beta <= alpha)
                 break;
         }
         return minEval;
     }
 }
 
 // Function to check valid moves for minimax
 function isValidMoveForMinimax(board, row, col, player) {
     if (board[row][col] !== EMPTY) {
         return false;
     }
     
     const opponent = player === BLACK ? WHITE : BLACK;
     const directions = [
         [-1, -1], [-1, 0], [-1, 1],
         [0, -1],           [0, 1],
         [1, -1],  [1, 0],  [1, 1]
     ];
     
     for (const [dr, dc] of directions) {
         let r = row + dr;
         let c = col + dc;
         let foundOpponent = false;
         
         while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
             foundOpponent = true;
             r += dr;
             c += dc;
         }
         
         if (foundOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
             return true;
         }
     }
     
     return false;
 }
 
 // Function to simulate moves for minimax
 function makeSimulatedMove(board, row, col, player) {
     board[row][col] = player;
     
     // Flip discs
     const directions = [
         [-1, -1], [-1, 0], [-1, 1],
         [0, -1],           [0, 1],
         [1, -1],  [1, 0],  [1, 1]
     ];
     
     directions.forEach(([dr, dc]) => {
         let r = row + dr;
         let c = col + dc;
         const discsToFlip = [];
         
         while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] !== EMPTY && board[r][c] !== player) {
             discsToFlip.push([r, c]);
             r += dr;
             c += dc;
         }
         
         if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
             discsToFlip.forEach(([fr, fc]) => {
                 board[fr][fc] = player;
             });
         }
     });
 }
 const validMoves = getValidMoves(ai_player)
 // Run minimax algorithm for each valid move
 for (const move of validMoves) {
     // Copy the board
     const boardCopy = board.map(row => [...row]);
     
     // Simulate the move
     makeSimulatedMove(boardCopy, move.row, move.col, ai_player);
     // Get minimax evaluation
     const score = minimax(boardCopy, MAX_DEPTH, -Infinity, Infinity, anti_ai_player , 0.3, 0.2, 0.5);
     // Update best score
     if (score > bestScore) {
         bestScore = score;
         bestMove = move;
     }
 }
 
 return bestMove 