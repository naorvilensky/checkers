import { CELL_COLOR, CELL_STATE, PIECE_PLACEMENTS } from "../checkersConstants";

export class GameCell {
    color: CELL_COLOR;
    i: number;
    j: number;
    key: string;
    cellState: CELL_STATE;
    allowedCell: boolean = false;
    eatenEnemy: GameCell | null = null;

    // TODO change to false
    private king: boolean = true;

    constructor(color: any, i: number, j: number) {
        const getCellState = (i: number, j: number): CELL_STATE => {
            const checkEven = (value: CELL_STATE): CELL_STATE => (j % 2 === 0 ? value : CELL_STATE.EMPTY);
            const checkOdd = (value: CELL_STATE): CELL_STATE => (j % 2 !== 0 ? value : CELL_STATE.EMPTY);
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
    }

    setAllowed(): void {
        this.allowedCell = true;
    }

    setUnAllowed(): void {
        this.allowedCell = false;
    }

    becomeKing(): void {
        this.king = true;
    }

    isKing(): boolean {
        return this.king;
    }
}
