import { Board } from "@/types/Board";
import { hasFourInARow, isBoardFull, makeMove } from "./TicTacToeEngine";
import { Cell } from "@/types/Cell";

type Move = {
    row: number;
    col: number;
};

function evaluateBoard(board: Board): number {
    let score = 0;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'O') {
                score += evaluatePosition(board, row, col, 'O');
            } else if (board[row][col] === 'X') {
                score -= evaluatePosition(board, row, col, 'X');
            }
        }
    }

    return score;
}

function evaluatePosition(board: Board, row: number, col: number, symbol: Cell): number {
    let score = 0;
    const directions = [
        [-1, 0], [1, 0],  // Vertical
        [0, -1], [0, 1],  // Horizontal
        [-1, -1], [-1, 1], // Diagonal
        [1, -1], [1, 1]   // Diagonal
    ];

    for (let [dirRow, dirCol] of directions) {
        let count = 0;
        for (let i = 0; i < 4; i++) {
            const newRow = row + dirRow * i;
            const newCol = col + dirCol * i;            
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && board[newRow][newCol] === symbol) {
                count++;
            } else {
                break;
            }
        }
        if (count === 4) {
            score += 1000;
        } else if (count === 3) {
            score += 50;
        } else if (count === 2) {
            score += 10;
        }

         // Evaluate the opponent
         const opponent = symbol === 'O' ? 'X' : 'O';
         count = 0;
         for (let i = 0; i < 4; i++) {
             const newRow = row + dirRow * i;
             const newCol = col + dirCol * i;            
             if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && board[newRow][newCol] === opponent) {
                 count++;
             } else {
                 break;
             }
         }
 
         if (count === 4) {
             score -= 1000;
         } else if (count === 3) {
             score -= 50;
         } else if (count === 2) {
             score -= 10;
         }
    }

    return score;
}

function minimaxWithAlphaBeta(board: Board, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number): number {
    const boardCopy = [...board.map(row => [...row])];
    
    const winner = hasFourInARow(board);
    if (winner !== null) return winner === 'X' ? -1 : 1;
    if (isBoardFull(board) || depth === 0) return evaluateBoard(board);

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of getPossibleMoves(board)) {
            const evaluation = minimaxWithAlphaBeta(makeMove(boardCopy, move.col, false), depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }        
        return maxEval;
    } else {
        let minEval = Infinity;        
        for (let move of getPossibleMoves(board)) {
            const evaluation = minimaxWithAlphaBeta(makeMove(boardCopy, move.col, true), depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}


export function computersMove(board: Board, depth: number = 2): Move {
    let bestScore = -Infinity;
    let bestMove: Move | null = null;
    const moves = getPossibleMoves(board);

    for (let move of moves) {
        const newBoard = makeMove(board, move.col, false);
        const score = minimaxWithAlphaBeta(newBoard, depth, false, -Infinity, Infinity);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;            
        }
    }

    return bestMove!;
}

function getPossibleMoves(board: Board): Move[] {
    const moves: Move[] = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === ' ' && (row === 5 || board[row+1][col] !== ' ')) {
                moves.push({ row, col });
            }
        }
    }
    return moves;
}