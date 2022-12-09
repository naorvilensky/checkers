import { CellCoordinates, NUMBER_OF_CELLS } from "./constants.js";
import { GameCell } from "./gameCell";
import { CELL_STATE } from "../checkersConstants";

export class GameBoard {
    gameState: CELL_STATE = CELL_STATE.EMPTY;
    board: GameCell[][];
    continuesToEnemies: boolean = false;

    constructor() {
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

        const kingMe = () => {
            switch (selectedCell.cellState) {
                case CELL_STATE.BLACK:
                    selectedCell.i === 0 && selectedCell.becomeKing();
                    break;
                case CELL_STATE.RED:
                    selectedCell.i === this.board.length - 1 && selectedCell.becomeKing();
                    break;
            }
        };
        const cellState = previousCell.cellState;
        previousCell.cellState = CELL_STATE.EMPTY;
        selectedCell.cellState = cellState;

        this.setAllCellsAsNotAllowed();

        if (selectedCell.eatenEnemy) {
            selectedCell.eatenEnemy.cellState = CELL_STATE.EMPTY;
            selectedCell.eatenEnemy = null;
            kingMe();
            return this.setAllowedEnemyCells(selectedCell);
        }

        kingMe();
        return false;
    }

    setAllowedCells({ i, j }: CellCoordinates) {
        this.setAllCellsAsNotAllowed();
        const cell: GameCell = this.board[i][j];
        const king = cell.isKing();

        // if there are enemies he can eat, the player must eat one of them
        if (this.setAllowedEnemyCells(cell)) {
            return true;
        }

        const direction = cell.cellState === CELL_STATE.RED ? 1 : -1;
        const checkDirection = (iDirection: number, jDirection: number) => {
            let cellWasAllowed = false;

            do {
                if (!this.checkValidCell(cell.i + iDirection, cell.j + jDirection)) {
                    return cellWasAllowed;
                }

                const c: GameCell = this.board[cell.i + iDirection][cell.j + jDirection];

                if (c.cellState !== CELL_STATE.EMPTY) {
                    return cellWasAllowed;
                }

                c.setAllowed();
                cellWasAllowed = true;

                iDirection += iDirection;
                jDirection += jDirection;
            } while (king);

            return cellWasAllowed;
        };

        let f1, f2, f3, f4;

        f1 = checkDirection(direction, 1);
        f2 = checkDirection(direction, -1);

        if (king) {
            f3 = checkDirection(-direction, 1);
            f4 = checkDirection(-direction, -1);
        }

        return f1 || f2 || f3 || f4;
    }

    setGameState(gameState: CELL_STATE) {
        if (this.gameState === gameState) {
            return;
        }

        this.gameState = gameState;
        this.checkAllowedPieces();
    }

    private checkAllowedPieces() {
        let enemiesAvailable = false;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                const cell = this.board[i][j];
                if (this.gameState !== cell.cellState) {
                    continue;
                }

                if (this.setAllowedEnemyCells(cell, false)) {
                    enemiesAvailable = true;
                    cell.setAllowed();
                }
            }
        }

        if (enemiesAvailable) {
            return;
        }

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                const cell = this.board[i][j];
                if (this.gameState === cell.cellState) {
                    cell.setAllowed();
                }
            }
        }
    }

    private setAllowedEnemyCells(cell: GameCell, allowCells: boolean = true) {
        const cellState = cell.cellState;
        const king = cell.isKing();

        const cellCheckup = (jDirection: number, iDirection: number) => {
            if (this.checkValidCell(cell.i + iDirection, cell.j + jDirection)) {
                do {
                    if (!this.checkValidCell(cell.i + iDirection, cell.j + jDirection)) {
                        return false;
                    }

                    const c = this.board[cell.i + iDirection][cell.j + jDirection];
                    console.log(c.cellState);

                    if (c.cellState !== cellState && c.cellState !== CELL_STATE.EMPTY) {
                        const c1 = this.board[cell.i + iDirection][cell.j + jDirection];
                        const allowedCell = c1.cellState === CELL_STATE.EMPTY;
                        if (allowCells) {
                            c1.allowedCell = allowedCell;
                            if (c1.allowedCell) {
                                c1.eatenEnemy = c;
                            }
                        }
                        return allowedCell;
                    } else if (cell.cellState !== cellState) {
                        console.log(cell);
                    }
                    iDirection += iDirection;
                    jDirection += jDirection;
                } while (king);
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
