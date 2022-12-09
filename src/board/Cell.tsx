import styled from "styled-components";
import CheckersPiece from "./CheckersPiece";
import { useMemo } from "react";
import { CELL_STATE, CHESS_PIECE_COLOR } from "./checkersConstants";

interface ContainerProps {
    cellSize: any;
    allowedCell: any;
    color: any;
    pointer: any;
}

interface CellProps {
    cellSize: any;
    color: any;
    cellState: any;
    onCellClicked: any;
    i: any;
    j: any;
    allowedCell: any;
    king: boolean;
}

const Container = styled.div<ContainerProps>`
    width: ${({ cellSize }) => cellSize}px;
    height: ${({ cellSize }) => cellSize}px;
    background-color: ${({ color, allowedCell }) => (allowedCell ? "#444444" : color)};
    padding: 8px;
    cursor: ${({ pointer }) => (pointer ? "pointer" : "auto")};
`;

export default function Cell({ cellSize, color, cellState, onCellClicked, i, j, allowedCell, king }: CellProps) {
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
        <Container
            cellSize={cellSize}
            color={color}
            pointer={allowedCell}
            allowedCell={allowedCell}
            onClick={() => allowedCell && onCellClicked(i, j)}
        >
            {pieceColor ? <CheckersPiece king={king} color={pieceColor} /> : null}
        </Container>
    );
}
