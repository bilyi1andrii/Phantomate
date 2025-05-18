import '../styles/HomePage.css';
import SignUpForm from '../components/SignUpForm';
import SideBar from '../components/SideBar.jsx';
import PostCreator from '../components/PostCreator';
import GhostImage from '../assets/cuteghost.gif';

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ghostIcon from '../assets/profile-icon.png';
import bopIcon from '../assets/phantom-profile.png';
import { onAuthStateChanged } from 'firebase/auth';

import BroChat from '../components/Chat';
import { auth, db } from '../config/firebase';
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    limit
} from 'firebase/firestore';

export default function PhantomatePage() {
    // throw new Error("Test error in HomePage");
    const location = useLocation();
    const [me, setMe] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);

    const [chatId, setChatId] = useState(null);
    const [chatWith, setChatWith] = useState(null);
    const [conversations, setConversations] = useState([]);

    const [unreadChats, setUnreadChats] = useState(new Set());
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, 'posts'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, snap => {
            (async () => {
                const postsWithAuthors = await Promise.all(
                    snap.docs.map(async d => {
                        const data = d.data();
                        let user = { username: 'Unknown', photoURL: '' };

                        if (data.author) {
                            const userSnap = await getDoc(data.author);
                            if (userSnap.exists()) {
                                user = userSnap.data();
                            }
                        }

                        return {
                            id: d.id,
                            imageURL: data.imageURL,
                            caption: data.caption,
                            timestamp: data.timestamp,
                            author: {
                                username: user.username,
                                photoURL: user.profilePictureUrl
                            }
                        };
                    })
                );

                setPosts(postsWithAuthors);
            })();
        });

        return () => unsubscribe();
    }, [db]);
    useEffect(() => {
        if (!conversations.length) return;

        const unsubscribers = conversations.map(({ chatId: convId }) => {
            const latestMsgQuery = query(
                collection(db, "chats", convId, "messages"),
                orderBy("timestamp", "desc"),
                limit(1)
            );

            return onSnapshot(latestMsgQuery, snap => {
                if (snap.empty) return;
                const msg = snap.docs[0].data();

                if (
                    msg.senderId !== auth.currentUser.uid &&
                    convId !== chatId
                ) {
                    setUnreadChats(prev => {
                        const next = new Set(prev);
                        next.add(convId);
                        return next;
                    });
                }
            });
        });

        return () => unsubscribers.forEach(unsub => unsub());
    }, [conversations, chatId]);

    const toggleChatMode = () => {
        setIsChatMode(prev => !prev);
    };
    useEffect(() => {
        let unsubProfile = null;

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                unsubProfile = onSnapshot(
                    doc(db, 'users', user.uid),
                    snap => {
                        if (snap.exists()) {
                            setMe({ uid: snap.id, ...snap.data() });
                        } else {
                            setMe({
                                uid: user.uid,
                                username: user.displayName || 'You',
                                photoURL: user.photoURL || ghostIcon
                            });
                        }
                    },
                    err => console.error(err)
                );
            } else {
                setMe(null);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubProfile) unsubProfile();
        };
    }, []);



    useEffect(() => {
        if (!me) return;

        const convCol = collection(db, 'users', me.uid, 'conversations');
        const unsubConv = onSnapshot(
            query(convCol, orderBy('createdAt', 'desc')),
            async snap => {
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
            window.history.replaceState({}, "");
        }
    }, [location.state]);

    const sortedConvs = (() => {
        if (!isChatMode || !chatId) return conversations;
        const active = conversations.find(c => c.chatId === chatId);
        const others = conversations.filter(c => c.chatId !== chatId);
        return active ? [active, ...others] : conversations;
    })();


    return (
        <div className="phantomate-page">
            <SideBar toggleChatMode={toggleChatMode} isChatMode={isChatMode} me={me} />
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
                                            setUnreadChats(prev => {
                                                const next = new Set(prev);
                                                next.delete(cId);
                                                return next;
                                            });
                                            setChatId(cId);
                                            setChatWith(profile);
                                            setIsChatMode(true);
                                        }
                                    }}
                                >
                                    {profile.username}
                                    {unreadChats.has(cId) && <span className="unread-badge" />}
                                </button>

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
                                                me={me}
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
                    <PostCreator me={me} />
                    {posts.map(p => (
                        <div key={p.id} className="post">
                            <div className="post-header">
                                <img src={p.author.photoURL || bopIcon} alt="" className="post-avatar" />
                                <h2 className="post-username">{p.author.username}</h2>
                            </div>
                            <p className="post-text">{p.caption}</p>
                            {p.imageURL && <img src={p.imageURL} className="post-image" alt="" />}
                        </div>
                    ))}
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
