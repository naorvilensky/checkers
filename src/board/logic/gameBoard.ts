import { CellCoordinates, NUMBER_OF_CELLS } from "./constants.js";
import { GameCell } from "./gameCell";
import { CELL_STATE } from "../checkersConstants";

export class GameBoard {
    gameState: CELL_STATE;
    board: GameCell[][];

    constructor(gameState: CELL_STATE) {
        this.gameState = gameState;
        this.board = [];
        for (let i = 0; i < NUMBER_OF_CELLS; i++) {
            this.board.push([]);
        }
    }

    addCell(color: any, i: number, j: number) {
        this.board[i][j] = new GameCell(color, i, j);
    }

    pieceChanged({ i, j }: CellCoordinates) {
        return this.board[i][j].cellState !== CELL_STATE.EMPTY;
    }

    cellMovement({ i: i1, j: j1 }: CellCoordinates, { i: i2, j: j2 }: CellCoordinates) {
        const previousCell = this.board[i1][j1];
        const selectedCell = this.board[i2][j2];

        const diff1 = (i2 - i1) / 2;
        const diff2 = (j2 - j1) / 2;
        if (Math.abs(diff1) === 1) {
            this.board[i2 - diff1][j2 - diff2].cellState = CELL_STATE.EMPTY;
        }

        const cellState = previousCell.cellState;
        previousCell.cellState = CELL_STATE.EMPTY;
        selectedCell.cellState = cellState;
        this.setAllCellsAsNotAllowed();
    }

    setAllowedCells({ i, j }: CellCoordinates) {
        this.setAllCellsAsNotAllowed();
        const cell: GameCell = this.board[i][j];

        const updateCell = (a: number, b: number) => {
            this.board[a][b].setAllowed();
            return true;
        };

        const checkCellAllowed = (a: number, b: number, cellState: CELL_STATE = CELL_STATE.EMPTY): any => {
            if (a < 0 || b < 0 || a >= NUMBER_OF_CELLS || b >= NUMBER_OF_CELLS) {
                return false;
            }

            const c: GameCell = this.board[a][b];

            if (c.cellState === cell.cellState) {
                return false;
            }

            if (c.cellState === CELL_STATE.EMPTY) {
                updateCell(a, b);
                return true;
            }

            if (c.cellState !== cell.cellState && cellState !== CELL_STATE.EMPTY) {
                const x = cellState === CELL_STATE.RED ? a + 1 : a - 1;
                const diff = j - b;

                return checkCellAllowed(x, b - diff);
            }
        };

        const x = cell.cellState === CELL_STATE.RED ? i + 1 : i - 1;

        const f1 = checkCellAllowed(x, j + 1, cell.cellState);
        const f2 = checkCellAllowed(x, j - 1, cell.cellState);

        return f1 || f2;
    }

    setAllCellsAsNotAllowed() {
        this.board.forEach((row: GameCell[]) => row.forEach((cell: GameCell) => cell.setUnAllowed()));
    }
}
