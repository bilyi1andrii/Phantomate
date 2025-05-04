import '../styles/HomePage.css';
import SignUpForm from '../components/SignUpForm';
import SideBar from '../components/SideBar.jsx';
import GhostImage from '../assets/cuteghost.gif';
import PostIcon1 from '../assets/post-icon1.png';
import PostIcon2 from '../assets/post-icon2.png';
import PostIm1 from '../assets/post1.png';
import PostIm2 from '../assets/post2.png';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PhantomatePage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [activeBro, setActiveBro] = useState(null);

    const toggleChatMode = () => {
        setIsChatMode(prev => !prev);
    };

    const handleBroClick = (broIndex) => {
        setActiveBro(broIndex);
        toggleChatMode();
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

    return (
        <div className="phantomate-page">
            <SideBar toggleChatMode={toggleChatMode} isChatMode={isChatMode} />
            <main className="main-content">
                <div className={`bro-list ${isChatMode ? 'expanded' : ''}`}>
                    <div className="bro-list-content">
                        {[...Array(6)].map((_, index) => (
                            <button
                                key={index}
                                className={`bro-button ${activeBro === index ? 'active' : ''}`}
                                onClick={() => handleBroClick(index)}
                            >
                                Bro {index + 1}
                            </button>
                        ))}
                        <div className="ghost-deco"></div>
                        <img src={GhostImage} alt="Ghost Decoration" className="ghost-image" />
                    </div>
                </div>

                <div className={`posts ${isChatMode ? 'compressed' : ''}`}>
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
