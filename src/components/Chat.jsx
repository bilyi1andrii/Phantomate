import { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';
import ghostIcon from '../assets/profile-icon.png';
import bopIcon from '../assets/phantom-profile.png';

export default function BroChat({ broIndex, onBack }) {
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

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { sender: 'you', text: trimmed }]);
        setInput('');

        setTimeout(() => {
            const replies = [
                'Do you believe in echoes of the soul?',
                'Silence can be louder than screams.',
                'I see you.',
                'Not every light is from the stars.',
                'You’re not alone in the fog.'
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            setMessages(prev => [...prev, { sender: 'bop', text: randomReply }]);
        }, 1000);
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
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.sender}`}>
                        <img
                            src={msg.sender === 'you' ? ghostIcon : bopIcon}
                            alt={msg.sender}
                            className="chat-icon"
                        />
                        <div className="chat-text">{msg.text}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
                <label className="image-upload">
                    📎
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
