import './App.css';
import styled from "styled-components";

function App() {
    const Button = styled.button`
      padding: 10px;
      border: 2px solid red;

      &:hover {
        cursor: pointer;
      }
    `
    return (
        <div className="App">
            <Button>
                <span>Hey!</span>
            </Button>
        </div>
    );
}

export default App;
