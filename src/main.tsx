import React from 'react'
import ReactDOM from 'react-dom/client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Layout from "./Layout.jsx";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Layout/>
        </Router>
    </React.StrictMode>,
)
