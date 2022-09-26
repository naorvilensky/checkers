import styled from "styled-components";
import ChessPiece from "./ChessPiece";
import { useMemo } from "react";
import { CELL_STATE, CHESS_PIECE_COLOR } from "./chessConstants";

const Container = styled.div`
    width: ${({ cellSize }) => cellSize}px;
    height: ${({ cellSize }) => cellSize}px;
    background-color: ${({ color, allowedCell }) => (allowedCell ? "#444444" : color)};
    padding: 8px;
    cursor: ${({ pointer }) => (pointer ? "pointer" : "auto")};
`;

export default function Cell({ cellSize, color, cellState, onCellClicked, i, j, gameState, allowedCell }) {
    const pieceColor = useMemo(() => {
        switch (cellState) {
            case CELL_STATE.RED:
                return CHESS_PIECE_COLOR.RED;
            case CELL_STATE.BLACK:
                return CHESS_PIECE_COLOR.BLACK;
            default:
                return;
        }
    }, [cellState]);

    const pointer = useMemo(() => cellState === gameState || allowedCell, [cellState, gameState, allowedCell]);

    return (
        <Container
            cellSize={cellSize}
            color={color}
            pointer={pointer}
            allowedCell={allowedCell}
            onClick={() => pointer && onCellClicked(i, j)}
        >
            {pieceColor ? <ChessPiece color={pieceColor} /> : null}
        </Container>
    );
}
