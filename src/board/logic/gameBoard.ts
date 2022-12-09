import { CellCoordinates, NUMBER_OF_CELLS } from "./constants.js";
import { GameCell } from "./gameCell";
import { CELL_STATE } from "../checkersConstants";

export class GameBoard {
    gameState: CELL_STATE;
    board: GameCell[][];
    continuesToEnemies: boolean = false;

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

        const cellState = previousCell.cellState;
        previousCell.cellState = CELL_STATE.EMPTY;
        selectedCell.cellState = cellState;

        this.setAllCellsAsNotAllowed();

        if (selectedCell.eatenEnemy) {
            selectedCell.eatenEnemy.cellState = CELL_STATE.EMPTY;
            selectedCell.eatenEnemy = null;
            return this.setAllowedEnemyCells(selectedCell);
        }
        return false;
    }

    setAllowedCells({ i, j }: CellCoordinates) {
        this.setAllCellsAsNotAllowed();
        const cell: GameCell = this.board[i][j];

        // if there are enemies he can eat, the player must eat one of them
        if (this.setAllowedEnemyCells(cell)) {
            return true;
        }

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

    private setAllowedEnemyCells(cell: GameCell) {
        const cellState = cell.cellState;

        const cellCheckup = (jDirection: number, iDirection: number) => {
            if (this.checkValidCell(cell.i + iDirection, cell.j + jDirection)) {
                const c: GameCell = this.board[cell.i + iDirection][cell.j + jDirection];
                if (
                    c.cellState !== cellState &&
                    c.cellState !== CELL_STATE.EMPTY &&
                    this.checkValidCell(cell.i + 2 * iDirection, cell.j + 2 * jDirection)
                ) {
                    const c1 = this.board[cell.i + 2 * iDirection][cell.j + 2 * jDirection];
                    c1.allowedCell = c1.cellState === CELL_STATE.EMPTY;
                    if (c1.allowedCell) {
                        c1.eatenEnemy = c;
                    }
                    return c1.allowedCell;
                }
            }

            return false;
        };

        this.continuesToEnemies =
            cellCheckup(-1, -1) || // left cell
            cellCheckup(+1, -1) || // right cell
            cellCheckup(-1, +1) || // left cell
            cellCheckup(+1, +1); // right cell

        return this.continuesToEnemies;
    }

    private checkValidCell(i: number, j: number) {
        if (i < 0 || i >= this.board.length) {
            return false;
        }

        return !(j < 0 || j >= this.board.length);
    }

    private setAllCellsAsNotAllowed() {
        this.board.forEach((row: GameCell[]) => row.forEach((cell: GameCell) => cell.setUnAllowed()));
    }
}
