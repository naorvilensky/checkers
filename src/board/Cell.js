import styled from "styled-components";
import ChessPiece from "./ChessPiece";
import { useEffect, useMemo } from "react";
import { CELL_COLOR, CELL_STATE, CHESS_PIECE_COLOR } from "./chessConstants";

const Container = styled.div`
    width: ${({ cellSize }) => cellSize}px;
    height: ${({ cellSize }) => cellSize}px;
    background-color: ${({ color }) => color};
    padding: 8px;
    cursor: ${({ pointer }) => (pointer ? "pointer" : "auto")};
`;

export default function Cell({ cellSize, color, cellState, piece, i, j, gameState, allowedCell }) {
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
    return (
        <Container cellSize={cellSize} color={color} pointer={cellState === gameState || allowedCell}>
            {pieceColor ? <ChessPiece color={pieceColor} /> : null}
        </Container>
    );
}
