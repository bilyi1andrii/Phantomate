import React, { useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

import '../styles/MatchPage.css';
import SideBar from '../components/SideBar.js';
import LikeIcon from '../assets/like.png';
import NopeIcon from '../assets/nope.png';
import ShuffleIcon from '../assets/shuffle.svg';
import ProfileImage from '../assets/phantom-profile.png';
import Match1 from '../assets/match1.png';
import Match2 from '../assets/match2.png';
import Match3 from '../assets/match3.png';
import Match4 from '../assets/match4.png';

export default function MatchPage() {
    const [bioVisible, setBioVisible] = useState(false);

    const handleNameClick = () => {
        setBioVisible(!bioVisible);
    };

    const handleRefreshClick = () => {
        console.log("Shuffle clicked!");
    };

    const likeRef = useRef(null);
    const nopeRef = useRef(null);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);
    const controls = useAnimation();

    const handleDragStart = () => {
        controls.stop();
        x.set(0);
        controls.set({ x: 0, rotate: 0, scale: 1, opacity: 1 });
    };
    
    const handleDragEnd = async (event, info) => {
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;
    
        if (offsetX !== 0) {
            const isLike = offsetX > 0;
            const ref = isLike ? likeRef : nopeRef;
            const dir = isLike ? 1 : -1;
    
            const iconRect = ref.current.getBoundingClientRect();
            const imgRect = event.target.getBoundingClientRect();
            const targetX =
                iconRect.left + iconRect.width / 2 -
                (imgRect.left + imgRect.width / 2);
    
            await controls.start({
                x: targetX,
                transition: { type: 'spring', stiffness: 150, damping: 20, bounce: 0, velocity: velocityX }
            });
    
            await controls.start({
                x: targetX + dir,
                scale: 0.1,
                opacity: 0,
                rotate: 20 * dir,
                transition: { duration: 0.4 }
            });
        } else {
            await controls.start({
                x: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 30, bounce: 0, velocity: velocityX }
            });
        }
    };
    return (
        <div className="match-page">
            <SideBar />
            <main className="match-main">
                <div className="swipe-section">
                    <div className="swipe-card">
                        <div className="swipe-header">
                            <img ref={nopeRef} src={NopeIcon} alt="Nope" className="swipe-btn" />
                            <motion.img
                                src={ProfileImage}
                                alt="Phantom profile"
                                className="profile-image-match"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                animate={controls}
                                style={{ x, rotate, cursor: 'grab' }}
                                whileTap={{ scale: 0.95 }}
                                whileDrag={{ scale: 1.1, opacity: 0.8 }}
                            />
                            <img ref={likeRef} src={LikeIcon} alt="Like" className="swipe-btn" />
                        </div>

                        <h3 className="phantom-name" onClick={handleNameClick}>
                            Shik shak shok
                        </h3>

                        {bioVisible && (
                            <div className="phantom-bio">
                                <span className="bio-location">📍 Mistwood Hollow</span><br />
                                I like misty walks through abandoned hills, whispering secrets to the wind, and occasionally under the moonlight. Bonus points if you don’t ghost me first.
                            </div>
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
                        {[
                            { name: 'Elara', age: 23, img: Match1, msg: "I don’t do small talk — I speak in ravensong and midnight songs." },
                            { name: 'Kael', age: 27, img: Match2, msg: "I come alive when the city sleeps. My bookshelf’s a mess — I get lost often, just like them." },
                            { name: 'Mira', age: 25, img: Match3, msg: "I believe some people are meant to find each other across realities." },
                            { name: 'Orion', age: 30, img: Match4, msg: "I live between midnight and dawn. My journal is a ritual of shadowed thoughts." },
                            { name: 'Brobro', age: 11, img: Match4, msg: "I live between midnight and dawn. My journal is a ritual of shadowed thoughts." }
                        ].map((match, index) => (
                            <div className="match-card" key={index}>
                                <img src={match.img} alt={match.name} className="match-avatar" />
                                <h3>{match.name}, {match.age}</h3>
                                <p className="match-text">{match.msg}</p>
                                <button className="message-btn">Message</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
