import { Board } from "@/types/Board";
import { hasFourInARow, isBoardFull, makeMove } from "./TicTacToeEngine";
import { Cell } from "@/types/Cell";
import { EVALUATION_BOARD, evaluatePosition } from "./SVTHandler";

type Move = {
    row: number;
    col: number;
};

let possibleNodes = 0;
let exploredNodes = 0;

function evaluateBoard(board: Board): number {
    let xScore = 0;
    let oScore = 0;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'X') {
                xScore += evaluatePosition(board, row, col, 'X');
                xScore += EVALUATION_BOARD[row][col];
            } else if (board[row][col] === 'O') {
                oScore -= evaluatePosition(board, row, col, 'O');
                oScore -= EVALUATION_BOARD[row][col];
            }
        }
    }

    return xScore - oScore;
}


function minimaxWithAlphaBeta(board: Board, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number): number {
    possibleNodes++;
    
    const boardCopy = [...board.map(row => [...row])];
    
    const winner = hasFourInARow(board);
    if (winner !== null) {
        exploredNodes++;
        return winner === 'X' ? 1000 : -1000;
    }
    if (isBoardFull(board) || depth === 0) {
        exploredNodes++;
        return evaluateBoard(board);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of getPossibleMoves(board)) {
            const newBoard = makeMove(boardCopy, move.col, false);
            const evaluation = minimaxWithAlphaBeta(newBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of getPossibleMoves(board)) {
            const newBoard = makeMove(boardCopy, move.col, true);
            const evaluation = minimaxWithAlphaBeta(newBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

export function computersMove(board: Board, depth: number = 2): { move: Move, possibleNodes: number, exploredNodes: number } {
    let bestScore = -Infinity;
    let bestMove: Move | null = null;
    const moves = getPossibleMoves(board);

    // Reset counters
    possibleNodes = 0;
    exploredNodes = 0;

    for (let move of moves) {
        const newBoard = makeMove(board, move.col, true);
        const score = minimaxWithAlphaBeta(newBoard, depth, false, -Infinity, Infinity);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;            
        }
    }

    return { move: bestMove!, possibleNodes, exploredNodes };
}

function getPossibleMoves(board: Board): Move[] {
    const moves: Move[] = [];
    for (let col = 0; col < board[0].length; col++) {
        for (let row = board.length - 1; row >= 0; row--) {
            if (board[row][col] === ' ') {
                moves.push({ row, col });
                break;
            }
        }
    }
    return moves;
}
