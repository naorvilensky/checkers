import styled from "styled-components";
import Cell from "./Cell";
import { useEffect, useRef, useState } from "react";
import { CELL_COLOR, CELL_STATE, STARTING_PLAYER } from "./checkersConstants";
import { BOARD_SIZE, BOARD_SIZE_ADDITION, NUMBER_OF_CELLS, CELL_SIZE, CellCoordinates } from "./logic/constants";
import { GameBoard } from "./logic/gameBoard";
import { GameCell } from "./logic/gameCell";

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
    const [gameState, setGameState] = useState<CELL_STATE>();
    const [cellSelected, setCellSelected] = useState<CellCoordinates>();
    const previousCellSelected = useRef<CellCoordinates | null>();
    const gameBoard = useRef<GameBoard>();
    const gameStateSetTwice = useRef<boolean>(false);
    const [, setUpdateGame] = useState(false);

    function updateGame() {
        setUpdateGame((game) => !game);
    }

    useEffect(() => {
        const board: GameBoard = gameBoard.current as GameBoard;

        if (!cellSelected) {
            return;
        }

        // player selected piece to move
        if (!previousCellSelected.current) {
            if (board.setAllowedCells(cellSelected)) {
                previousCellSelected.current = cellSelected;
                updateGame();
            }
        } else {
            // he might have pressed a different piece
            // he has to continue using the same piece if he can eat other enemies
            if (board.pieceChanged(cellSelected) && !board.continuesToEnemies) {
                board.setAllowedCells(cellSelected);
                previousCellSelected.current = cellSelected;
                updateGame();
                return;
            }

            // player moved that piece
            setGameState((gameState: any) => {
                const gs = gameState === CELL_STATE.RED ? CELL_STATE.BLACK : CELL_STATE.RED;

                if (gameStateSetTwice.current) {
                    gameStateSetTwice.current = false;
                    return board.gameState;
                }

                gameStateSetTwice.current = true;

                if (!previousCellSelected.current) {
                    board.setGameState(gs);
                    return gs;
                }

                if (previousCellSelected.current) {
                    board.cellMovement(previousCellSelected.current, cellSelected);
                }

                if (board.continuesToEnemies) {
                    previousCellSelected.current = cellSelected;
                    updateGame();
                    return gameState;
                }

                previousCellSelected.current = null;
                board.setGameState(gs);

                if (board.gameState === gameState) {
                    updateGame();
                }

                return board.gameState;
            });
        }
    }, [cellSelected]);

    // on mounted
    useEffect(() => {
        let color = CELL_COLOR.WHITE;
        gameBoard.current = new GameBoard();
        let board: GameBoard = gameBoard.current;
        for (let i = 0; i < NUMBER_OF_CELLS; i++) {
            for (let j = 0; j < NUMBER_OF_CELLS; j++) {
                board.addCell(color, i, j);
                if (j < NUMBER_OF_CELLS - 1) {
                    color = color === CELL_COLOR.WHITE ? CELL_COLOR.BLACK : CELL_COLOR.WHITE;
                }
            }
        }

        board.setGameState(STARTING_PLAYER);
        setGameState(STARTING_PLAYER);
    }, []);

    return (
        <Container>
            <div style={{ width: "100%", padding: "8px", textAlign: "center", background: gameState, color: "white" }}>
                Currently Playing: {gameState}
            </div>
            {gameBoard.current &&
                gameBoard.current.board.map((row) =>
                    row.map((cell: GameCell) => (
                        <Cell
                            color={cell.color}
                            cellSize={CELL_SIZE}
                            key={cell.i + "" + cell.j}
                            i={cell.i}
                            j={cell.j}
                            cellState={cell.cellState}
                            onCellClicked={(i: number, j: number) => setCellSelected({ i, j })}
                            allowedCell={cell.allowedCell}
                        />
                    )),
                )}
        </Container>
    );
}
