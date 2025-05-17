import '../styles/HomePage.css';
import SignUpForm from '../components/SignUpForm';
import SideBar from '../components/SideBar.jsx';
import PostCreator from '../components/PostCreator';
import GhostImage from '../assets/cuteghost.gif';
import PostIcon1 from '../assets/post-icon1.png';
import PostIcon2 from '../assets/post-icon2.png';
import PostIm1 from '../assets/post1.png';
import PostIm2 from '../assets/post2.png';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import BroChat from '../components/Chat';
import { auth, db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';

export default function PhantomatePage() {
    const location = useLocation();
    const [me, setMe] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [activeBro, setActiveBro] = useState(null);

    const [chatId, setChatId] = useState(null);
    const [chatWith, setChatWith] = useState(null);
    const [conversations, setConversations] = useState([]);

    const toggleChatMode = () => {
        setIsChatMode(prev => !prev);
    };
    useEffect(() => {
        // 1) get current user
        const unsubAuth = auth.onAuthStateChanged(u => {
            setMe(u);
        });
        return unsubAuth;
    }, []);

    useEffect(() => {
        if (!me) return;

        // 2) listen for conversation docs under users/{me.uid}/conversations
        const convCol = collection(db, 'users', me.uid, 'conversations');
        const unsubConv = onSnapshot(
            query(convCol, orderBy('createdAt', 'desc')),
            async snap => {
                // for each conversation doc, pull the other user's profile
                const convs = await Promise.all(
                    snap.docs.map(async d => {
                        const otherUid = d.id;
                        const { chatId } = d.data();
                        const userSnap = await getDoc(doc(db, 'users', otherUid));
                        const profile = userSnap.exists()
                            ? { id: otherUid, ...userSnap.data() }
                            : { id: otherUid, username: 'Unknown' };
                        return { otherUid, chatId, profile };
                    })
                );
                setConversations(convs);
            }
        );

        return unsubConv;
    }, [me]);

    const handleBroClick = (broIndex) => {
        if (isChatMode && activeBro === broIndex) {
            setIsChatMode(false);
            setActiveBro(null);
        } else {
            setActiveBro(broIndex);
            setIsChatMode(true);
        }
    };

    useEffect(() => {
        if (location.state?.showSignupForm) {
            setShowModal(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (location.state?.openChat) {
            setChatId(location.state.chatId);
            setChatWith(location.state.chatWith);
            setIsChatMode(true);
            // clear history so state doesn’t persist on reload
            window.history.replaceState({}, "");
        }
    }, [location.state]);

    const sortedConvs = (() => {
        if (!isChatMode || !chatId) return conversations;
        // pull out the active one
        const active = conversations.find(c => c.chatId === chatId);
        const others = conversations.filter(c => c.chatId !== chatId);
        return active ? [active, ...others] : conversations;
    })();


    return (
        <div className="phantomate-page">
            <SideBar toggleChatMode={toggleChatMode} isChatMode={isChatMode} />
            <main className="main-content">
                <div className={`bro-list ${isChatMode ? 'expanded' : ''}`}>
                    <div className="bro-list-content">
                        {sortedConvs.map(({ chatId: cId, profile }) => (
                            <React.Fragment key={cId}>
                                <button
                                    className={`bro-button ${chatId === cId && isChatMode ? 'active' : ''}`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (isChatMode && chatId === cId) {
                                            setIsChatMode(false);
                                            setChatId(null);
                                            setChatWith(null);
                                        } else {
                                            setChatId(cId);
                                            setChatWith(profile);
                                            setIsChatMode(true);
                                        }
                                    }}
                                >
                                    {profile.username}
                                </button>

                                {/* right under the active button, open the panel */}
                                {isChatMode && chatId === cId && chatWith && (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            className="bro-chat-slot"
                                            key={cId + '-panel'}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <BroChat
                                                chatId={chatId}
                                                chatWith={chatWith}
                                                onBack={() => {
                                                    setIsChatMode(false);
                                                    setChatId(null);
                                                    setChatWith(null);
                                                }}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </React.Fragment>
                        ))}

                        {(!chatId || !chatWith) && (
                            <button
                                className="ghost-button"
                                onClick={e => {
                                    e.stopPropagation();
                                    toggleChatMode();
                                }}
                            >
                                <img src={GhostImage} alt="New chat" className="ghost-image" />
                            </button>
                        )}


                    </div>
                </div>

                <div className={`posts ${isChatMode ? 'compressed' : ''}`}>
                    <PostCreator />
                    <div className="post">
                        <div className="post-header">
                            <img src={PostIcon1} alt="Ghost Avatar" className="post-avatar" />
                            <h2 className="post-username">Umbrelith</h2>
                        </div>
                        <p className="post-text">"Where shadows connect..."</p>
                        <img src={PostIm1} alt="Umbrelith" className="post-image" />
                    </div>

                    <div className="post">
                        <div className="post-header">
                            <img src={PostIcon2} alt="Ghost Avatar" className="post-avatar" />
                            <h2 className="post-username">Nyxveil</h2>
                        </div>
                        <p className="post-text">"Not every connection needs..."</p>
                        <img src={PostIm2} alt="Nyxveil" className="post-image" />
                    </div>
                </div>

                {showModal && (
                    <div className="popup-overlay">
                        <SignUpForm onClose={() => setShowModal(false)} />
                    </div>
                )}
            </main>
        </div>
    );
}
