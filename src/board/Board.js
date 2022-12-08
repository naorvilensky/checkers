import styled from "styled-components";
import Cell from "./Cell";
import { useEffect, useRef, useState } from "react";
import { CELL_COLOR, CELL_STATE, STARTING_PLAYER } from "./checkersConstants";
import { BOARD_SIZE, BOARD_SIZE_ADDITION, NUMBER_OF_CELLS, CELL_SIZE } from "./logic/constants";
import { GameBoard } from "./logic/gameBoard";

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
    const [, setGameState] = useState(null);
    const [cellSelected, setCellSelected] = useState(null);
    const previousCellSelected = useRef(null);
    const gameBoard = useRef(null);
    const [, setUpdateGame] = useState(false);

    useEffect(() => {
        const board = gameBoard.current;
        if (!cellSelected) {
            return;
        }

        // player selected piece to move
        if (!previousCellSelected.current) {
            board.setAllowedCells(cellSelected);
            previousCellSelected.current = cellSelected;
            setUpdateGame((game) => !game);
        } else {
            // player moved that piece
            setGameState((gameState) => {
                const gs = gameState === CELL_STATE.RED ? CELL_STATE.BLACK : CELL_STATE.RED;
                if (!previousCellSelected.current) {
                    board.gameState = gs;
                    return gs;
                }
                if (previousCellSelected.current) {
                    board.cellMovement(previousCellSelected.current, cellSelected);
                    previousCellSelected.current = null;
                }

                board.gameState = gs;
            });
        }
    }, [cellSelected]);

    // on mounted
    useEffect(() => {
        let color = CELL_COLOR.WHITE;
        gameBoard.current = new GameBoard(STARTING_PLAYER);
        let board = gameBoard.current;
        for (let i = 0; i < NUMBER_OF_CELLS; i++) {
            for (let j = 0; j < NUMBER_OF_CELLS; j++) {
                board.addCell(color, i, j);
                if (j < NUMBER_OF_CELLS - 1) {
                    color = color === CELL_COLOR.WHITE ? CELL_COLOR.BLACK : CELL_COLOR.WHITE;
                }
            }
        }

        setGameState(STARTING_PLAYER);
    }, []);

    return (
        <Container>
            {gameBoard.current &&
                gameBoard.current.board.map((row) =>
                    row.map((cell) => (
                        <Cell
                            color={cell.color}
                            cellSize={CELL_SIZE}
                            key={cell.i + "" + cell.j}
                            i={cell.i}
                            j={cell.j}
                            cellState={cell.cellState}
                            gameState={gameBoard.current.gameState}
                            onCellClicked={(i, j) => setCellSelected({ i, j })}
                            allowedCell={cell.allowedCell}
                        />
                    )),
                )}
        </Container>
    );
}
