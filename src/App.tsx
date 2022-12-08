import "./App.css";
import styled from "styled-components";
import Board from "./board";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding-top: 50px;
    flex-direction: row;
    justify-content: center;
`;

function App() {
    return (
        <div className="App">
            <Container>
                <Board />
            </Container>
        </div>
    );
}

export default App;
