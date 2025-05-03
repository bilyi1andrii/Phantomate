import '../styles/HomePage.css';
import SignUpForm from '../components/SignUpForm';
import SideBar from '../components/SideBar.jsx';
import GhostImage from '../assets/cuteghost.svg';
import PostIcon1 from '../assets/post-icon1.png';
import PostIcon2 from '../assets/post-icon2.png';
import PostIm1 from '../assets/post1.png';
import PostIm2 from '../assets/post2.png';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function PhantomatePage() {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (location.state?.showSignupForm) {
            setShowModal(true);
        }
    }, [location.state]);

    return (
        <div className="phantomate-page">
            <SideBar />
            <main className="main-content">
                <div className="bro-list">
                    <div className="bro-list-content">
                        <button className="bro-button">Bro 1</button>
                        <button className="bro-button">Bro 2</button>
                        <button className="bro-button">Bro 3</button>
                        <button className="bro-button">Bro 4</button>
                        <button className="bro-button">Bro 5</button>
                        <button className="bro-button">Bro 6</button>
                        <div className="ghost-deco">
                    </div>
                        <img src={GhostImage} alt="Ghost Decoration" className="ghost-image"/>
                    </div>
                </div>

                <div className="posts">
                    <div className="post">
                        <div className="post-header">
                            <img src={PostIcon1} alt="Ghost Avatar" className="post-avatar" />
                            <h2 className="post-username">Umbrelith</h2>
                        </div>
                        <p className="post-text">
                            "Where shadows connect. Find souls that match your aura in the mist of Phantomate."
                        </p>
                        <img src={PostIm1} alt="Umbrelith" className="post-image" />
                    </div>

                    <div className="post">
                        <div className="post-header">
                            <img src={PostIcon2} alt="Ghost Avatar" className="post-avatar" />
                            <h2 className="post-username">Nyxveil</h2>
                        </div>
                        <p className="post-text">
                            "Not every connection needs a heartbeat. Swipe through spirits that feel... familiar."
                        </p>
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
