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
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
`;
export default function CheckersPiece({ color, king }: any) {
    return (
        <Container>
            <Inner color={color}>{king && "king"}</Inner>
        </Container>
    );
}
