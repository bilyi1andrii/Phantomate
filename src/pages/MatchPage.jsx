import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { onSnapshot, collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/MatchPage.css';
import SideBar from '../components/SideBar.jsx';
import LikeIcon from '../assets/like.png';
import NopeIcon from '../assets/nope.png';
import ShuffleIcon from '../assets/shuffle.png';
import ProfileImage from '../assets/phantom-profile.png';
import ArrowLike from '../assets/matchlike.gif';
import ArrowNope from '../assets/matchnope.gif';


export default function MatchPage() {
    const [bioVisible, setBioVisible] = useState(false);
    const [profileIndex, setProfileIndex] = useState(0);
    const [me, setMe] = useState(null);

    const controls = useAnimation();

    const navigate = useNavigate();

    const likeRef = useRef(null);
    const nopeRef = useRef(null);
    const cardRef = useRef(null);
    const hasInitialDeck = useRef(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);


    const [profiles, setProfiles] = useState([])
    const [swipedIds, setSwipedIds] = useState(new Set());
    const [matchedIds, setMatchedIds] = useState(new Set());
    const [matchesProfiles, setMatchesProfiles] = useState([]);
    const [deck, setDeck] = useState([]);
    const [conversationIds, setConversationIds] = useState(new Set());

    const [swipesLoaded, setSwipesLoaded] = useState(false);
    const [matchesLoaded, setMatchesLoaded] = useState(false);


    useEffect(() => {
        hasInitialDeck.current = false;
    }, [me?.uid]);

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
        const convRef = collection(db, "users", me.uid, "conversations");
        return onSnapshot(convRef, snap => {
            setConversationIds(new Set(snap.docs.map(d => d.id)));
        });
    }, [me]);

    useEffect(() => {
        if (!me) return;
        return onSnapshot(collection(db, "users"), snap => {
            const others = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(p => p.id !== me.uid);
            setProfiles(others);
        });
    }, [me]);

    useEffect(() => {
        if (!me) return;
        setSwipesLoaded(false);
        const path = collection(db, "users", me.uid, "swipes");
        return onSnapshot(path, snap => {
            const likedIds = snap.docs
                .filter(d => d.data().liked === true)
                .map(d => d.id);
            setSwipedIds(new Set(likedIds));
            setSwipesLoaded(true);
        });
    }, [me]);

    useEffect(() => {
        if (!me) return;
        setMatchesLoaded(false);
        const path = collection(db, "users", me.uid, "matches");
        return onSnapshot(path, snap => {
            const ids = snap.docs.map(d => d.id);
            setMatchedIds(new Set(ids));
            setMatchesLoaded(true);

            Promise.all(ids.map(uid => getDoc(doc(db, "users", uid))))
                .then(docs => {
                    const data = docs
                        .filter(d => d.exists())
                        .map(d => ({ id: d.id, ...d.data() }));
                    setMatchesProfiles(data);
                });
        });
    }, [me]);

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }


    useEffect(() => {
        if (!me) return;
        if (hasInitialDeck.current) return;
        if (!swipesLoaded || !matchesLoaded) return;
        if (profiles.length === 0) return;

        const remaining = profiles.filter(p =>
            !swipedIds.has(p.id) &&
            !matchedIds.has(p.id)
        );

        setDeck(remaining);
        setProfileIndex(0);
        hasInitialDeck.current = true;
    }, [
        me,
        profiles,
        swipedIds,
        matchedIds,
        swipesLoaded,
        matchesLoaded
    ]);

    const currentProfile = deck[profileIndex] || null;
    const isDeckEmpty = profileIndex >= deck.length;


    const handleNameClick = () => {
        setBioVisible(!bioVisible);
    };

    const handleRefreshClick = () => {
        const remaining = profiles.filter(p => !swipedIds.has(p.id) && !matchedIds.has(p.id));
        setDeck(shuffleArray(remaining));
        setProfileIndex(0);
        controls.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
        x.set(0);
    };

    const saveSwipe = async (otherUid, isLike) => {
        if (!me) {
            return;
        }
        const mySwipeRef = doc(db, 'users', me.uid, 'swipes', otherUid);
        await setDoc(mySwipeRef, { liked: isLike, timestamp: serverTimestamp() });

        if (isLike) {
            const theirSwipeRef = doc(db, 'users', otherUid, 'swipes', me.uid);
            const snap = await getDoc(theirSwipeRef);

            if (snap.exists() && snap.data().liked) {
                const matchData = { matchedAt: serverTimestamp() };
                await Promise.all([
                    setDoc(doc(db, 'users', me.uid, 'matches', otherUid), matchData),
                    setDoc(doc(db, 'users', otherUid, 'matches', me.uid), matchData),
                ]);
            }
        }
    };

    const handleDragStart = () => {
        controls.stop();
        x.set(0);
        controls.set({ x: 0, rotate: 0, scale: 1, opacity: 1 });
    };
    ;

    const handleDragEnd = async (event, info) => {
        const offsetX = info.offset.x;
        if (Math.abs(offsetX) > 100 && currentProfile) {
            const isLike = offsetX > 0;
            const iconRef = isLike ? likeRef : nopeRef;

            const iconRect = iconRef.current.getBoundingClientRect();
            const imgRect = event.target.getBoundingClientRect();
            const deltaX = iconRect.left + iconRect.width / 2 - (imgRect.left + imgRect.width / 2);
            const deltaY = iconRect.top + iconRect.height / 2 - (imgRect.top + imgRect.height / 2);

            const pivot = isLike ? '100% 50%' : '0% 50%';
            const fullSpin = isLike ? 360 : -360;

            await controls.start({
                x: x.get() + deltaX,
                y: deltaY,
                rotate: [0, fullSpin],
                skewX: [0, 15, -15, 10, 0],
                skewY: [0, -10, 10, -5, 0],
                scale: [1, 0.8, 0.5, 0.1],
                opacity: 0,
                transition: {
                    duration: 0.7,
                    ease: 'easeInOut'
                }
            }, {
                transformOrigin: pivot
            });
            controls.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, skewX: 0, skewY: 0 });
            x.set(0);
            setProfileIndex(i => i + 1);
            setBioVisible(false);

            await saveSwipe(currentProfile.id, isLike);
        } else {
            await controls.start({
                x: 0, rotate: 0, skewX: 0, skewY: 0,
                scale: 1, opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 30 }
            });
        }
    };

    const handleMessageClick = async (profile) => {
        if (!me) return;
        const otherUid = profile.id;

        const chatId = [me.uid, otherUid].sort().join("_");

        await setDoc(doc(db, "chats", chatId), {
            participants: [me.uid, otherUid],
            createdAt: serverTimestamp()
        }, { merge: true });

        await Promise.all([
            setDoc(doc(db, "users", me.uid, "conversations", otherUid), {
                chatId, createdAt: serverTimestamp()
            }),
            setDoc(doc(db, "users", otherUid, "conversations", me.uid), {
                chatId, createdAt: serverTimestamp()
            })
        ]);

        navigate("/home", {
            state: { openChat: true, chatId, chatWith: profile }
        });
    };

    return (
        <div className="match-page">
            <SideBar me={me} />
            <main className="match-main">
                <div className="swipe-section">
                    <div className={`swipe-card ${isDeckEmpty ? 'empty' : ''}`} ref={cardRef}>
                        {isDeckEmpty ? (
                            <div className="no-profiles-message">
                                <p>Sorry, no more profiles to choose from. Please refresh!</p>
                            </div>
                        ) : (
                            <>
                                <div className="swipe-header">
                                    <div className="swipe-btn-wrapper">
                                        <img ref={nopeRef} src={NopeIcon} alt="Nope" className="swipe-btn" />
                                        <span className="swipe-label">Nope</span>
                                    </div>
                                    <img src={ArrowNope} alt="Arrow Nope" className="arrow-icon left-arrow" />

                                    {currentProfile && (
                                        <motion.img
                                            key={currentProfile.id}
                                            src={currentProfile.profilePictureUrl || ProfileImage}
                                            alt={currentProfile.username}
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
                                    <img src={ArrowLike} alt="Arrow Like" className="arrow-icon right-arrow" />
                                    <div className="swipe-btn-wrapper">
                                        <img ref={likeRef} src={LikeIcon} alt="Like" className="swipe-btn" />
                                        <span className="swipe-label">Like</span>
                                    </div>
                                </div>

                                {currentProfile && (
                                    <>
                                        <h3 className="phantom-name" onClick={handleNameClick}>
                                            {currentProfile.username}
                                        </h3>

                                        {bioVisible && (
                                            <div className="phantom-bio">
                                                {currentProfile.joke.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
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
                    <div className="match-cards">
                        {matchesProfiles
                            .filter(p => !conversationIds.has(p.id))
                            .map((p, i) => (
                                <div className="match-card" key={i}>
                                    <div className="match-header">
                                        <img src={p.profilePictureUrl || ProfileImage} alt={p.username} className="match-avatar" />
                                        <div className="match-info"><h3>{p.username}</h3></div>
                                    </div>
                                    <p className="match-text">{p.joke}</p>
                                    <button className="message-btn" onClick={() => handleMessageClick(p)}>
                                        Message
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
