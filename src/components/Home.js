import React from "react";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styling/Home.css'

function Home() {

    const navigate = useNavigate();
    const createRoom = () =>{
        const roomId = uuidv4();
        navigate(`/editor/${roomId}`);
    }

    
    return (
        <div className="main-screen">
            <div className="play-btn-cntnr">
                <button id="playground-btn" onClick={createRoom} >Create a playground!</button>
            </div>
            
        </div>
    );
}

export default Home;