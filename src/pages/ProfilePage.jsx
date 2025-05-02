import { useState } from 'react';
import '../styles/ProfilePage.css';
import SideBar from '../components/SideBar.jsx';
import GhostAvatar from '../assets/profile-icon.png';
import EmptyGhost from '../assets/cuteghost.svg';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile-posts');

    return (
        <div className="profile-page">
            <SideBar hideProfileButton={true} />
            <main className="profile-main">
                <div className="profile-container">
                    <div className="profile-header">
                        <img src={GhostAvatar} alt="Avatar" className="avatar" />
                        <div className="header-right">
                            <h1 className="username">MyName</h1>
                            <div className="stats">
                                <span><strong>0</strong> profile-posts</span>
                                <span><strong>6</strong> friends</span>
                                <span><strong>12</strong> likes received</span>
                            </div>
                        </div>
                        <button className="edit-button">Edit profile</button>
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
                        <div className="empty-state">
                            <p className="empty-title">Nothing to see yet</p>
                            <div className="empty-card">
                                <img src={EmptyGhost} alt="Ghost" className="empty-img" />
                                <p className="empty-msg">Publish your imagination 💡</p>
                                <button className="publish-button">Publish now</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <div className="info-section">
                            <p>This user hasn't added any info yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

