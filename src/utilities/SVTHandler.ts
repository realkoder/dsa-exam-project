import { Board } from "@/types/Board";

export const EVALUATION_BOARD = [
    [3, 4,  5,  7,  5, 4, 3],
    [4, 6,  8, 10,  8, 6, 4],
    [5, 8, 11, 13, 11, 8, 5],
    [5, 8, 11, 13, 11, 8, 5],
    [4, 6,  8, 10,  8, 6, 4],
    [3, 4,  5,  7,  5, 4, 3],
];



export function evaluatePosition(board: Board, row: number, col: number, symbol: string): number {
    let score = 0;
    const directions = [
        [-1,  0], [ 1, 0],   // Vertical
        [ 0, -1], [ 0, 1],   // Horizontal
        [-1, -1], [-1, 1],   // Diagonal
        [ 1, -1], [ 1, 1],   // Diagonal
    ];

    const opponent = symbol === 'X' ? 'O' : 'X';
    const isMaximizer = symbol === 'X';

    for (let [dirRow, dirCol] of directions) {
        let count = 0;
        let block = 0;
        // Check in the forward direction
        for (let i = 1; i < 4; i++) {
            const newRow = row + dirRow * i;
            const newCol = col + dirCol * i;
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol] === symbol) {
                    count++;
                } else if (board[newRow][newCol] === opponent) {
                    block++;
                    break;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        // Evaluate the forward direction
        score += evaluateDirection(isMaximizer, count, block);

        // Reset for reverse direction
        count = 0;
        block = 0;
        // Check in the reverse direction
        for (let i = 1; i < 4; i++) {
            const newRow = row - dirRow * i;
            const newCol = col - dirCol * i;
            if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol] === symbol) {
                    count++;
                } else if (board[newRow][newCol] === opponent) {
                    block++;
                    break;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        // Evaluate the reverse direction
        score += evaluateDirection(isMaximizer, count, block);
    }

    return score;
}

function evaluateDirection(isMaximizer: boolean, count: number, block: number): number {
    let directionScore = 0;
    if (isMaximizer) {
        directionScore += count * 10;
        if (block === 0 && count === 3) {
            directionScore += 1000; // Potential winning move for maximizer
        } else if (block === 0 && count === 2) {
            directionScore += 100; // Potential good move for maximizer
        }
    } else {
        directionScore -= count * 10;
        if (block === 0 && count === 3) {
            directionScore -= 1000; // Potential winning move for minimizer
        } else if (block === 0 && count === 2) {
            directionScore -= 100; // Potential good move for minimizer
        }
    }
    return directionScore;
}