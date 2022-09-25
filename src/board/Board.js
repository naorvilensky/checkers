import styled from "styled-components";
import Cell from "./Cell";
import { useEffect, useState } from "react";
import { CELL_COLOR, CELL_STATE, CHESS_PIECE_COLOR, PIECE_PLACEMENTS } from "./chessConstants";

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
    const [cells, setCells] = useState([]);
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
    useEffect(() => {
        let color = CELL_COLOR.WHITE;
        const cellDup = [];
        for (let i = 0; i < NUMBER_OF_CELLS; i++) {
            cellDup.push([]);
            for (let j = 0; j < NUMBER_OF_CELLS; j++) {
                cellDup[i].push(
                    <Cell
                        color={color}
                        cellSize={CELL_SIZE}
                        key={i + "" + j}
                        i={i}
                        j={j}
                        cellState={getCellPiece(i, j)}
                    />,
                );
                if (j < NUMBER_OF_CELLS - 1) {
                    color = color === CELL_COLOR.WHITE ? CELL_COLOR.BLACK : CELL_COLOR.WHITE;
                }
            }
        }

        setCells(cellDup);
    }, []);

    return <Container>{cells}</Container>;
}
