import React, { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/MatchPage.css';
import SideBar from '../components/SideBar.jsx';
import LikeIcon from '../assets/like.png';
import NopeIcon from '../assets/nope.png';
import ShuffleIcon from '../assets/shuffle.svg';
import ProfileImage from '../assets/phantom-profile.png';
import Match1 from '../assets/match1.gif';
import Match2 from '../assets/match2.jpg';

const mockProfiles = [
    {
        id: 'phantom123',
        name: 'Shik shak shok',
        img: ProfileImage,
        bio: '📍 Mistwood Hollow\nI like misty walks through abandoned hills...',
    },
    {
        id: 'elara456',
        name: 'Elara',
        img: Match1,
        bio: '📍 Moonlit Fields\nI speak in metaphors and midnight songs.',
    },
    {
        id: 'kael789',
        name: 'Kael',
        img: Match2,
        bio: '📍 Twilight Alley\nI get lost in books and shadows.',
    },
];

export default function MatchPage() {
    const [bioVisible, setBioVisible] = useState(false);
    const [swipes, setSwipes] = useState([]);
    const [profileIndex, setProfileIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isEmptyProfiles, setIsEmptyProfiles] = useState(false);  // Додано для перевірки наявності профілів

    const currentProfile = mockProfiles[profileIndex] || null;
    const navigate = useNavigate();

    const likeRef = useRef(null);
    const nopeRef = useRef(null);
    const cardRef = useRef(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);
    const controls = useAnimation();

    const handleNameClick = () => {
        setBioVisible(!bioVisible);
    };

    const handleRefreshClick = () => {
        const randomDirection = Math.random() > 0.5 ? 1 : -1;
        const nextItem = (profileIndex + randomDirection + mockProfiles.length) % mockProfiles.length;
        setProfileIndex(nextItem);
        setDirection(randomDirection);
        setIsEmptyProfiles(false);  // Скидаємо стан, коли профілі є
    };

    const saveSwipe = async (phantomId, direction) => {
        setSwipes((prev) => [
            ...prev,
            { phantomId, direction, timestamp: Date.now() },
        ]);
        console.log(`(Mock) Swipe saved: ${direction} on ${phantomId}`);
    };

    const handleDragStart = () => {
        controls.stop();
        x.set(0);
        controls.set({ x: 0, rotate: 0, scale: 1, opacity: 1 });
    };

    const handleDragEnd = async (event, info) => {
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;

        if (Math.abs(offsetX) > 100 && currentProfile) {
            const isLike = offsetX > 0;
            const direction = isLike ? 'like' : 'nope';
            const dir = isLike ? 1 : -1;
            const iconRef = isLike ? likeRef : nopeRef;

            const iconRect = iconRef.current.getBoundingClientRect();
            const imgRect = event.target.getBoundingClientRect();

            const deltaX =
                iconRect.left + iconRect.width / 2 -
                (imgRect.left + imgRect.width / 2);

            const deltaY =
                iconRect.top + iconRect.height / 2 -
                (imgRect.top + imgRect.height / 2);

            await saveSwipe(currentProfile.id, direction);

            await controls.start({
                x: x.get() + deltaX,
                y: deltaY,
                scale: 0.1,
                opacity: 0,
                transition: { duration: 0.4, ease: 'easeInOut' },
            });

            controls.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
            setBioVisible(false);
            setProfileIndex((prev) => prev + 1);

            // Перевірка на наявність профілів після свайпу
            if (profileIndex + 1 >= mockProfiles.length) {
                setIsEmptyProfiles(true);
            }
        } else {
            await controls.start({
                x: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 30 },
            });
        }
    };

    const handleMessageClick = (profile) => {
        navigate("/home", {
            state: { activeBro: profile }
        });
    };

    return (
        <div className="match-page">
            <SideBar />
            <main className="match-main">
                <div className="swipe-section">
                    <div className={`swipe-card ${isEmptyProfiles ? 'empty' : ''}`} ref={cardRef}>
                        {isEmptyProfiles ? (
                            <div className="no-profiles-message">
                                <p>Sorry, no more profiles to choose from. Please refresh!</p>
                            </div>
                        ) : (
                            <>
                                <div className="swipe-header">
                                    <img ref={nopeRef} src={NopeIcon} alt="Nope" className="swipe-btn" />
                                    {currentProfile && (
                                        <motion.img
                                            key={currentProfile.id}
                                            src={currentProfile.img}
                                            alt={currentProfile.name}
                                            className="profile-image-match"
                                            drag="x"
                                            dragElastic={0.2}
                                            dragConstraints={cardRef}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                            animate={controls}
                                            style={{ x, rotate, cursor: 'grab' }}
                                            whileTap={{ scale: 0.95 }}
                                            whileDrag={{ scale: 1.1, opacity: 0.8 }}
                                        />
                                    )}
                                    <img ref={likeRef} src={LikeIcon} alt="Like" className="swipe-btn" />
                                </div>

                                {currentProfile && (
                                    <>
                                        <h3 className="phantom-name" onClick={handleNameClick}>
                                            {currentProfile.name}
                                        </h3>

                                        {bioVisible && (
                                            <div className="phantom-bio">
                                                {currentProfile.bio.split('\n').map((line, i) => (
                                                    <span key={i}>{line}<br /></span>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        <div className="swipe-refresh-wrapper">
                            <span className="swipe-refresh-text">Two spirits, one swipe!</span>
                            <button className="swipe-refresh" onClick={handleRefreshClick}>
                                <img src={ShuffleIcon} alt="shuffle" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="matched-section">
                    <h2 className="match-title">Matched phantoms</h2>
                    <p className="match-subtitle">Your matched souls await.</p>

                    <div className="match-cards">
                        {swipes
                            .filter((s) => s.direction === 'like')
                            .map((swipe, index) => {
                                const match = mockProfiles.find(p => p.id === swipe.phantomId);
                                return match ? (
                                    <div className="match-card" key={index}>
                                        <div className="match-header">
                                            <img src={match.img} alt={match.name} className="match-avatar" />
                                            <div className="match-info">
                                                <h3>{match.name}</h3>
                                            </div>
                                        </div>
                                        <p className="match-text">{match.bio}</p>
                                        <button className="message-btn" onClick={() => handleMessageClick(match)}>
                                            Message
                                        </button>
                                    </div>
                                ) : null;
                            })}
                    </div>
                </div>
            </main>
        </div>
    );
}
