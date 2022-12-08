export const NUMBER_OF_CELLS = 8;
export const BOARD_SIZE = Math.min(window.screen.width, window.screen.height);
export const CELL_SIZE = Math.floor(BOARD_SIZE / NUMBER_OF_CELLS);
export const BOARD_SIZE_ADDITION = CELL_SIZE === BOARD_SIZE / NUMBER_OF_CELLS ? 2 : 0;

export interface CellCoordinates {
    i: number;
    j: number;
}
