import '../styles/HomePage.css';
import SignUpForm from '../components/SignUpForm';
import SideBar from '../components/SideBar.jsx';
import PostCreator from '../components/PostCreator';
import GhostImage from '../assets/cuteghost.gif';
import PostIcon1 from '../assets/post-icon1.png';
import PostIcon2 from '../assets/post-icon2.png';
import PostIm1 from '../assets/post1.png';
import PostIm2 from '../assets/post2.png';
import Post from '../components/Post';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from "../config/firebase"
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import BroChat from '../components/Chat';

export default function PhantomatePage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [activeBro, setActiveBro] = useState(null);
    const [posts, setPosts] = useState([]);

    const toggleChatMode = () => {
        setIsChatMode(prev => !prev);
    };

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
        if (location.pathname === "/home") {
            setIsChatMode(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.state?.activeBro) {
            setActiveBro(location.state.activeBro);
            setIsChatMode(true);
        }
    }, [location.state]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsArray);
        });

        return () => unsubscribe();
    }, []);


    return (
        <div className="phantomate-page">
            <SideBar toggleChatMode={toggleChatMode} isChatMode={isChatMode} />
            <main className="main-content">
                <div className={`bro-list ${isChatMode ? 'expanded' : ''}`}>
                    <div className="bro-list-content" onClick={toggleChatMode}>
                        {activeBro !== null && (
                            <button
                                className="bro-button active"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBroClick(activeBro);
                                }}
                            >
                                Bro {activeBro + 1}
                            </button>
                        )}

                        {isChatMode && (
                        <AnimatePresence mode="wait">
                            {activeBro !== null && (
                            <motion.div
                                key={activeBro}
                                className="bro-chat-slot"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <BroChat broIndex={activeBro} onBack={() => setIsChatMode(false)} />
                            </motion.div>
                            )}
                        </AnimatePresence>
                        )}

                        {[...Array(6)].map((_, index) => {
                            if (index === activeBro) return null;
                            return (
                                <button
                                    key={index}
                                    className="bro-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBroClick(index);
                                    }}
                                >
                                    Bro {index + 1}
                                </button>
                            );
                        })}
                        <button className="ghost-button">
                            <img src={GhostImage} alt="Ghost Decoration" className="ghost-image" />
                        </button>
                    </div>
                </div>

                <div className={`posts ${isChatMode ? 'compressed' : ''}`}>
                    <PostCreator />
                    {/* <h1> Posts </h1> */}
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            username={post}
                            caption={post.caption}
                            imageURL={post.imageURL}
                            avatarURL={PostIcon1}
                        />
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
