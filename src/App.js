import React from "react";
import CodeEditor from "./components/CodeEditor"
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/editor/:roomId" element={<CodeEditor/>}></Route>
            </Routes>
        </Router>
    )
}

export default App;