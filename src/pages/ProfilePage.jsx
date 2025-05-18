import { useState, useEffect } from 'react';
import { db, storage, auth } from "../config/firebase"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/ProfilePage.css';
import SideBar from '../components/SideBar.jsx';
import GhostAvatar from '../assets/profile-icon.png';
import EmptyGhost from '../assets/cuteghost.png';
import SignUpForm from '../components/SignUpForm';
import ConfirmSignOutPopup from '../components/ConfirmSignOutPopup.jsx';
import PostsGrid from '../components/PostsGrid.jsx';
import PostIm1 from '../assets/post1.png';
import PostIm2 from '../assets/post2.png';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile-posts');
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [profile, setProfile] = useState({});
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const orderedFields = [
        { key: 'username', label: 'Name' },
        { key: 'age', label: 'Age' },
        { key: 'pizza', label: 'Favorite Pizza' },
        { key: 'joke', label: 'Best joke' },
    ];


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                const snap = await getDoc(doc(db, "users", u.uid));
                if (snap.exists()) setProfile(snap.data());
            }
        });
        return unsubscribe;
    }, []);


    useEffect(() => {
        if (!user) return;

        async function fetchPosts() {

            setPosts([
                { id: '1', imageUrl: PostIm1, description: 'Why do Java developers wear glasses?\nBecause they don’t see sharp! 😎' },
                { id: '2', imageUrl: PostIm2, description: 'How many programmers does it take to change a light bulb?\nNone, that’s a hardware problem! 💡🖥️' },
                { id: '3', imageUrl: PostIm1, description: 'Post 3' },
                { id: '4', imageUrl: PostIm2, description: 'Post 4' },
                { id: '5', imageUrl: PostIm2, description: 'How many programmers does it take to change a light bulb?\nNone, that’s a hardware problem! 💡🖥️' },
            ]);
        }

        fetchPosts();
    }, [user]);

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) {
            return
        }

        if (!user) {
            console.error('No user is signed in.');
            return;
        }

        const picRef = ref(storage, `profilePics/${user.uid}`);

        await uploadBytes(picRef, file);

        const url = await getDownloadURL(picRef);

        await updateDoc(doc(db, "users", user.uid), { profilePictureUrl: url })

        setProfile(prev => ({ ...prev, profilePictureUrl: url }));

        console.log('Profile picture updated!');
    }

    return (
        <div className="profile-page">
            <SideBar hideProfileButton={true} />
            <main className="profile-main">
                <div className="profile-container">
                    <div className="profile-header">
                        <label htmlFor="avatar-upload">
                            <img
                                src={profile.profilePictureUrl || GhostAvatar}
                                alt="Avatar"
                                className="avatar"
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className="header-right">
                            <div className="name-stats">
                                <h1 className="username">{profile.username}</h1>
                                <div className="stats">
                                    <span><strong>0</strong> profile-posts</span>
                                    <span><strong>6</strong> friends</span>
                                    <span><strong>12</strong> likes received</span>
                                </div>
                            </div>
                            <div className="header-buttons">
                                <button className="edit-button" onClick={() => setShowPopup(true)}>Edit profile</button>
                                <button className="signout-button" onClick={() => setShowConfirmPopup(true)}>Sign out</button>
                            </div>
                        </div>
                    </div>

                    <div className="tabs">
                        <button
                            className={activeTab === 'info' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('info')}
                        >
                            Info
                        </button>
                        <button
                            className={activeTab === 'profile-posts' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('profile-posts')}
                        >
                            Profile posts
                        </button>
                    </div>
                    <hr className="tab-line" />

                    {activeTab === 'profile-posts' && (
                        <>
                            {posts.length === 0 ? (
                                <div className="empty-state">
                                    <p className="empty-title">Nothing to see yet</p>
                                    <div className="empty-card">
                                        <img src={EmptyGhost} alt="Ghost" className="empty-img" />
                                        <p className="empty-msg">Publish your imagination 💡</p>
                                        <button className="publish-button">Publish now</button>
                                    </div>
                                </div>
                            ) : (
                                <PostsGrid posts={posts} username={profile.username} />
                            )}
                        </>
                    )}

                    {activeTab === 'info' && (
                        <div className="info-section">
                            {profile && Object.keys(profile).length > 0 ? (
                                <div className="profile-info-cards">
                                    {orderedFields.map(({ key, label }) => {
                                        if (!(key in profile)) return null;
                                        return (
                                            <div key={key} className="info-card">
                                                <div className="info-card-key">{label}</div>
                                                <div className="info-card-value">{profile[key]}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>This user hasn't added any info yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            {showPopup && (
                <div className="popup-overlay">
                    <SignUpForm onClose={() => setShowPopup(false)} />
                </div>
            )}
            {showConfirmPopup && (
                <ConfirmSignOutPopup onCancel={() => setShowConfirmPopup(false)} />
            )}
        </div>
    );
}

