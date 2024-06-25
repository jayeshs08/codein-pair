// CodeEditor.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import '../styling/CodeEditor.css'
const socket = io("https://codein-pair-servercode.onrender.com");

function CodeEditor() {
    const { roomId } = useParams();
    const [code, setCode] = useState("// some comment");
    const [userCount, setUserCount] = useState(0);
    const [language, setLanguage] = useState('cpp');

    const languages =['cpp', 'javascript', 'java']

    useEffect(() => {
        console.log('Joining room:', roomId);
        socket.emit('join_room', roomId);

        socket.on('user_count', (count) => {
            console.log('User count updated:', count);
            setUserCount(count);
        });

        socket.on('code_update', (newCode) => {
            setCode(newCode);
        });

        return () => {
            socket.off('user_count');
            socket.off('code_update');
        };
    }, [roomId]);

    const handleEditorChange = (value) => {
        setCode(value);
        socket.emit('code_change', { roomId, code: value });
    };

    const handleLanguageChange =(event) =>{
        setLanguage(event.target.value);
    }


    

    const languageMapping = {
        javascript: 63,
        java: 62,
        cpp: 54,
    };
    
    return (
        <div>
            <div className="navbar">
                <span id="user-count">Users connected: {userCount}, (Send the URL link to your friends to start coding together!)</span>
                <select value={language} onChange={handleLanguageChange}>
                    {languages.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
                
            </div>
            <div className="editor">
            <Editor
                theme="vs-dark"
                language={language}
                value={code}
                onChange={handleEditorChange}
            />
            </div>
        </div>
    );
}

export default CodeEditor;
