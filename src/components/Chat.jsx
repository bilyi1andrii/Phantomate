import { useState, useRef, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import '../styles/Chat.css';
import ghostIcon from '../assets/profile-icon.png';
import bopIcon from '../assets/phantom-profile.png';
import { button } from 'framer-motion/client';

export default function BroChat({ chatId, chatWith, me, onBack }) {
    const [messages, setMessages] = useState([
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageCaption, setImageCaption] = useState('');

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            setImageCaption('');
            setShowImageModal(true);
        }
    };

    const handleCancelImage = () => {
        setShowImageModal(false);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleImageSend = async () => {
        if (!file) return;
        setUploading(true);

        const imgRef = storageRef(storage, `chats/${chatId}/images/${Date.now()}_${file.name}`);

        await uploadBytes(imgRef, file);

        const url = await getDownloadURL(imgRef);

        await addDoc(collection(db, "chats", chatId, "messages"), {
            imageURL: url,
            caption: imageCaption.trim() || null,
            senderId: auth.currentUser.uid,
            timestamp: serverTimestamp()
        });

        setFile(null);
        setUploading(false);
        setShowImageModal(false);
        setImageCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
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
            {showImageModal && (
                <div className="modal-overlay" onClick={handleCancelImage}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="modal-image-preview"
                        />
                        <textarea
                            placeholder="Write a caption..."
                            value={imageCaption}
                            onChange={e => setImageCaption(e.target.value)}
                            rows={3}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCancelImage} disabled={uploading}>
                                Cancel
                            </button>
                            <button onClick={handleImageSend} disabled={uploading}>
                                {uploading ? "Uploading…" : "Send Image"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const isYou = msg.senderId === auth.currentUser.uid;
                    return (
                        <div key={index} className={`chat-bubble ${isYou ? 'you' : 'bop'}`}>
                            <img
                                src={
                                    isYou
                                        ? me?.profilePictureUrl || ghostIcon
                                        : chatWith?.profilePictureUrl || bopIcon
                                }
                                alt={isYou ? 'You' : chatWith?.username || 'Friend'}
                                className="chat-icon"
                            />
                            {msg.imageURL
                                ? (
                                    <div className="chat-image-container">
                                        <img
                                            src={msg.imageURL}
                                            alt="attachment"
                                            className="chat-image"
                                        />
                                        {msg.caption && (
                                            <div className="chat-caption">{msg.caption}</div>
                                        )}
                                    </div>
                                )
                                : <div className="chat-text">{msg.text}</div>
                            }
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
                <label className="image-upload">
                    IMG
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
