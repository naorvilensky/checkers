import { CELL_STATE, PIECE_PLACEMENTS } from "../checkersConstants";

export class GameCell {
    constructor(color, i, j) {
        const getCellState = (i, j) => {
            const checkEven = (value) => (j % 2 === 0 ? value : CELL_STATE.EMPTY);
            const checkOdd = (value) => (j % 2 !== 0 ? value : CELL_STATE.EMPTY);
            const red = CELL_STATE.RED,
                black = CELL_STATE.BLACK;
            switch (i) {
                case PIECE_PLACEMENTS.RED:
                    return checkOdd(red);
                case PIECE_PLACEMENTS.RED + 1:
                    return checkEven(red);
                case PIECE_PLACEMENTS.RED + 2:
                    return checkOdd(red);
                case PIECE_PLACEMENTS.BLACK:
                    return checkEven(black);
                case PIECE_PLACEMENTS.BLACK + 1:
                    return checkOdd(black);
                case PIECE_PLACEMENTS.BLACK + 2:
                    return checkEven(black);
                default:
                    return CELL_STATE.EMPTY;
            }
        };
        this.color = color;
        this.i = i;
        this.j = j;
        this.key = i + "" + j;
        this.cellState = getCellState(i, j);
        this.allowedCell = false;
    }

    setAllowed() {
        this.allowedCell = true;
    }

    setUnAllowed() {
        this.allowedCell = false;
    }
}
