import { Board } from "@/types/Board";
import { hasFourInARow, isBoardFull } from "./TicTacToeEngine";

type Move = {
    row: number;
    col: number;
};


function minimaxWithAlphaBeta(board: Board, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number): number {
    const winner = checkWin(board);
    if (winner !== null) return winner === 'X' ? -1 : 1;
    if (isBoardFull(board) || depth === 0) return 0;

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of getPossibleMoves(board)) {
            const evaluation = minimaxWithAlphaBeta(makeMove(board, move, 'O'), depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of getPossibleMoves(board)) {
            const evaluation = minimaxWithAlphaBeta(makeMove(board, move, 'X'), depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}


export function computersMove(board: Board, depth: number = 5): Move {
    let bestScore = -Infinity;
    let bestMove: Move | null = null;

    for (let move of getPossibleMoves(board)) {
        const newBoard = makeMove(board, move, 'O');
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
            if (board[row][col] === ' ') { // Assuming ' ' represents an empty cell
                moves.push({ row, col });
            }            
        }
    }
    return moves;
}


function makeMove(board: Board, move: Move, player: 'X' | 'O'): Board {
    const newBoard = board.map(row => [...row]);
    if (newBoard[move.row][move.col] === ' ') {
        newBoard[move.row][move.col] = player;
    }
    return newBoard;
}

function checkWin(board: Board): 'X' | 'O' | null {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = board[row][col];
            if (cell !== ' ' && hasFourInARow(board, row, col, cell)) {
                return cell as 'X' | 'O';
            }
        }
    }
    return null;
}
