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

        const checkCellAllowed = (a: number, b: number): any => {
            if (!this.checkValidCell(a, b)) {
                return false;
            }

            const c: GameCell = this.board[a][b];

            if (c.cellState !== CELL_STATE.EMPTY) {
                return false;
            }

            this.board[a][b].setAllowed();
            return true;
        };

        const direction = cell.cellState === CELL_STATE.RED ? i + 1 : i - 1;

        const f1 = checkCellAllowed(direction, j + 1);
        const f2 = checkCellAllowed(direction, j - 1);

        return f1 || f2;
    }

    private setAllCellsAsNotAllowed() {
        this.board.forEach((row: GameCell[]) => row.forEach((cell: GameCell) => cell.setUnAllowed()));
    }

    private setAllowedEnemyCells(cell: GameCell) {
        let leftCell;
        let rightCell;
        const cellState = cell.cellState;

        const direction = cellState === CELL_STATE.RED ? 1 : -1;
        let nextI = cell.i + direction;

        if (this.checkValidCell(nextI, 0)) {
            return false;
        }

        if (this.checkValidCell(nextI, cell.j - 1)) {
            leftCell = this.board[nextI][cell.j - 1];
        }

        if (this.checkValidCell(nextI, cell.j + 1)) {
            rightCell = this.board[nextI][cell.j + 1];
        }
    }

    private checkValidCell(i: number, j: number) {
        if (i < 0 || i >= this.board.length) {
            return false;
        }

        return !(j < 0 || j >= this.board.length);
    }
}
