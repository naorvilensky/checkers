import "./App.css";
import styled from "styled-components";
import Board from "./board";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
