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
        let xScore = 0;
        let oScore = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 'X') {
                    xScore += EVALUATION_BOARD[i][j];
                } else if (board[i][j] === 'O') {
                    oScore += EVALUATION_BOARD[i][j];
                }
            }
        }
    
        let score = 0;
        const directions = [
            [-1,  0], [ 1, 0],  // Vertical
            [ 0, -1], [ 0, 1],  // Horizontal
            [-1, -1], [-1, 1],  // Diagonal
            [ 1, -1], [ 1, 1]   // Diagonal
        ];
    
        const opponent = symbol === 'X' ? 'O' : 'X';
    
        for (let [dirRow, dirCol] of directions) {
            let count = 0;
            let block = 0;
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
            score += count * 10;
            if (block === 0 && count === 3) {
                score += 50; // Potential winning move
            } else if (block === 0 && count === 2) {
                score += 10; // Potential good move
            }
    
            // Check for opponent
            count = 0;
            block = 0;
            for (let i = 1; i < 4; i++) {
                const newRow = row + dirRow * i;
                const newCol = col + dirCol * i;
                if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                    if (board[newRow][newCol] === opponent) {
                        count++;
                    } else if (board[newRow][newCol] === symbol) {
                        block++;
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            score -= count * 10;
            if (block === 0 && count === 3) {
                score -= 1000; 
            }
        }
    
        return score;
    }