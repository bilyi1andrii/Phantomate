import { useState, useRef, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import '../styles/Chat.css';
import ghostIcon from '../assets/profile-icon.png';
import bopIcon from '../assets/phantom-profile.png';
import { button } from 'framer-motion/client';

export default function BroChat({ chatId, chatWith, onBack }) {
    const [messages, setMessages] = useState([
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) setFile(f);
    };

    const handleImageSend = async () => {
        if (!file) return;
        setUploading(true);

        // 1) Create a storage ref under chats/{chatId}/images/
        const imgRef = storageRef(storage, `chats/${chatId}/images/${Date.now()}_${file.name}`);

        // 2) Upload the file
        await uploadBytes(imgRef, file);

        // 3) Get its download URL
        const url = await getDownloadURL(imgRef);

        // 4) Write a Firestore message with imageURL
        await addDoc(collection(db, "chats", chatId, "messages"), {
            imageURL: url,
            senderId: auth.currentUser.uid,
            timestamp: serverTimestamp()
        });

        // 5) Reset
        setFile(null);
        setUploading(false);
    };

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
                            {msg.imageURL
                                ? <img src={msg.imageURL} alt="attachment" className="chat-image" />
                                : <div className="chat-text">{msg.text}</div>
                            }
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
                <label className="image-upload">
                    Img
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                {file
                    ? <button onClick={handleImageSend} disabled={uploading}>
                        {uploading ? "Uploading…" : "Send Image"}
                    </button>

                    : <button onClick={handleSend}>Send</button>
                }
            </div>
        </div>
    );
}
