import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import "App.css";

// route imports
import Board from "board";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Board />,
    },
]);

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding-top: 50px;
    flex-direction: row;
    justify-content: center;
`;

export default function App() {
    return (
        <Container>
            <RouterProvider router={router} />
        </Container>
    );
}
