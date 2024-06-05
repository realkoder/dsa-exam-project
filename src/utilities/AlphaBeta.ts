import { Board } from "@/types/Board";
import { hasFourInARow, isBoardFull, makeMove } from "./TicTacToeEngine";
import { EVALUATION_BOARD, evaluatePosition } from "./SVTHandler";
import PriorityQueue from "@/modules/Queue/PriorityQueue";

type Move = {
    row: number;
    col: number;
    score: number;
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

    const moves = getPossibleMoves(board);

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;

        while (!moves.isEmpty()) {
            const move = moves.removeFirst();
            const newBoard = makeMove(boardCopy, move?.col!, false);
            const evaluation = minimaxWithAlphaBeta(newBoard, depth - 1, true, alpha, beta);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;

        while (!moves.isEmpty()) {
            const move = moves.removeFirst();
            const newBoard = makeMove(boardCopy, move?.col!, false);
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

    while (!moves.isEmpty()) {
        const move = moves.removeFirst();
        const newBoard = makeMove(board, move?.col!, true);
        const score = minimaxWithAlphaBeta(newBoard, depth - 1, false, -Infinity, Infinity);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move!;
        }
    }

    return { move: bestMove!, possibleNodes, exploredNodes };
}

function getPossibleMoves(board: Board): PriorityQueue<Move> {
    const movesQueue: PriorityQueue<Move> = new PriorityQueue((a, b) => (b.score - a.score));
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === ' ' && (row === 5 || board[row+1][col] !== ' ')) {
                movesQueue.add({ row, col, score: EVALUATION_BOARD[row][col] });
            }
        }
    }

    console.log("-----------------")
    console.log(movesQueue.getFirst());
    return movesQueue;
}


