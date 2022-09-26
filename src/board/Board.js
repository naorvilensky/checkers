import styled from "styled-components";
import Cell from "./Cell";
import { cloneElement, useEffect, useRef, useState } from "react";
import { CELL_COLOR, CELL_STATE, PIECE_PLACEMENTS, STARTING_PLAYER } from "./chessConstants";

const NUMBER_OF_CELLS = 8;
const BOARD_SIZE = Math.min(window.screen.width, window.screen.height);
const CELL_SIZE = Math.floor(BOARD_SIZE / NUMBER_OF_CELLS);
const BOARD_SIZE_ADDITION = CELL_SIZE === BOARD_SIZE / NUMBER_OF_CELLS ? 2 : 0;
const Container = styled.div`
    width: ${BOARD_SIZE + BOARD_SIZE_ADDITION}px;
    height: ${BOARD_SIZE + BOARD_SIZE_ADDITION}px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid black;
    box-shadow: 3px 6px 17px 5px rgba(0, 0, 0, 0.47);
`;
export default function Board() {
    const [gameState, setGameState] = useState(STARTING_PLAYER);
    const [cellSelected, setCellSelected] = useState();
    const [cells, setCells] = useState([]);
    const previousCellSelected = useRef();

    const getCellPiece = (i, j) => {
        const checkEven = (value) => (j % 2 === 0 ? value : null);
        const checkOdd = (value) => (j % 2 !== 0 ? value : null);
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

    const setAllowedCells = (cell, cells) => {
        const i = cell.props.i;
        const j = cell.props.j;

        const updateCell = (a, b) => {
            cells[a][b] = cloneElement(cells[a][b], { allowedCell: true });
            return true;
        };

        const checkCellAllowed = (a, b, cellState = CELL_STATE.EMPTY) => {
            if (a < 0 || b < 0 || a >= NUMBER_OF_CELLS || b >= NUMBER_OF_CELLS) {
                return false;
            }

            const c = cells[a][b];

            if (c.props.cellState === cell.cellState) {
                return false;
            }

            if (c.props.cellState === CELL_STATE.EMPTY) {
                updateCell(a, b);
                return true;
            }

            if (c.props.cellState !== cell.cellState && cellState !== CELL_STATE.EMPTY) {
                const x = cellState === CELL_STATE.RED ? a + 1 : a - 1;
                const f1 = checkCellAllowed(x, b + 1);
                const f2 = checkCellAllowed(x, b - 1);

                return f1 || f2;
            }
        };

        const x = cell.props.cellState === CELL_STATE.RED ? i + 1 : i - 1;

        const f1 = checkCellAllowed(x, j + 1, cell.props.cellState);
        const f2 = checkCellAllowed(x, j - 1, cell.props.cellState);

        return f1 || f2;
    };

    useEffect(() => {
        if (!cellSelected) {
            return;
        }

        const updateCellsGameState = (cells, gs, args = {}) =>
            cells.map((row) => row.map((cell) => cloneElement(cell, { gameState: gs, ...args })));

        // player selected piece to move
        if (!previousCellSelected.current) {
            setCells((cells) => {
                if (!setAllowedCells(cells[cellSelected[0]][cellSelected[1]], cells)) {
                    return cells;
                }

                previousCellSelected.current = cellSelected;
                return updateCellsGameState(cells, null);
            });
        } else {
            // player moved that piece
            setGameState((gameState) => {
                const gs = gameState === CELL_STATE.RED ? CELL_STATE.BLACK : CELL_STATE.RED;
                if (!previousCellSelected.current) {
                    return gs;
                }
                setCells((cells) => {
                    const cellsDup = [...cells];
                    if (previousCellSelected.current) {
                        const [i1, j1] = previousCellSelected.current;
                        const [i2, j2] = cellSelected;
                        const cellState = cellsDup[i1][j1].props.cellState;
                        const diff1 = (i2 - i1) / 2;
                        const diff2 = (j2 - j1) / 2;
                        if (Math.abs(diff1) === 1) {
                            cellsDup[i2 - diff1][j2 - diff2] = cloneElement(cellsDup[i2 - diff1][j2 - diff2], {
                                cellState: CELL_STATE.EMPTY,
                            });
                        }
                        cellsDup[i1][j1] = cloneElement(cellsDup[i1][j1], { cellState: CELL_STATE.EMPTY });
                        cellsDup[i2][j2] = cloneElement(cellsDup[i2][j2], { cellState });
                        previousCellSelected.current = null;
                    }
                    return updateCellsGameState(cellsDup, gs, {
                        allowedCell: false,
                    });
                });
                return gs;
            });
        }
    }, [cellSelected]);

    useEffect(() => {
        let color = CELL_COLOR.WHITE;
        const cellsDup = [];
        for (let i = 0; i < NUMBER_OF_CELLS; i++) {
            cellsDup.push([]);
            for (let j = 0; j < NUMBER_OF_CELLS; j++) {
                cellsDup[i].push(
                    <Cell
                        color={color}
                        cellSize={CELL_SIZE}
                        key={i + "" + j}
                        i={i}
                        j={j}
                        cellState={getCellPiece(i, j)}
                        gameState={STARTING_PLAYER}
                        onCellClicked={(i, j) => setCellSelected([i, j])}
                    />,
                );
                if (j < NUMBER_OF_CELLS - 1) {
                    color = color === CELL_COLOR.WHITE ? CELL_COLOR.BLACK : CELL_COLOR.WHITE;
                }
            }
        }

        setCells(cellsDup);
    }, []);

    return <Container>{cells}</Container>;
}
