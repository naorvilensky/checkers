import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;
`;

const Inner = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${({ color }) => color};
    border: 4px solid white;
`;
export default function ChessPiece({ color }) {
    return (
        <Container>
            <Inner color={color} />
        </Container>
    );
}
