import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from "./Layout.tsx";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Layout/>
        </Router>
    </React.StrictMode>,
)
