import { useState, useRef, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import '../styles/Chat.css';
import ghostIcon from '../assets/profile-icon.png';
import bopIcon from '../assets/phantom-profile.png';

export default function BroChat({ chatId, chatWith, onBack }) {
    const [messages, setMessages] = useState([
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }
    }, [messages]);

    useEffect(() => {
        if (!chatId) return;
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp")
        );
        const unsub = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, [chatId]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;
        await addDoc(
            collection(db, "chats", chatId, "messages"),
            {
                text,
                senderId: auth.currentUser.uid,
                timestamp: serverTimestamp()
            }
        );
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bro-chat themed-chat">
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const isYou = msg.senderId === auth.currentUser.uid;
                    return (
                        <div key={index} className={`chat-bubble ${isYou ? 'you' : 'bop'}`}>
                            <img
                                src={isYou ? ghostIcon : bopIcon}
                                alt={isYou ? 'you' : 'bop'}
                                className="chat-icon"
                            />
                            <div className="chat-text">{msg.text}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
                <label className="image-upload">
                    Img
                    <input type="file" accept="image/*" />
                </label>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
