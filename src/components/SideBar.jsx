import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import LogoIcon from '../assets/logo-icon.png';
import HomeIcon from '../assets/home-icon.png';
import MatchIcon from '../assets/match-icon.png';
import ChatIcon from '../assets/chat-icon.png';
import TestIcon from '../assets/test-icon.png';
import ProfIcon from '../assets/profile-icon.png';
import '../styles/Sidebar.css';
import ConfirmSignOutPopup from '../components/ConfirmSignOutPopup.jsx';

export default function Sidebar({ hideProfileButton = false }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOutClick = (event) => {
        event.preventDefault();
        setDropdownOpen(false);
        setShowConfirmPopup(true);
    };

    return (
        <>
            <aside className="sidebar">
                <div className="logo">
                    <img src={LogoIcon} alt="Logo" className="logo-icon" />
                    <h1 className="logo-text">Phantomate</h1>
                </div>

                <nav className="nav-links">
                    <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img src={HomeIcon} alt="Home Icon" className="nav-icon" />
                        Home
                    </NavLink>
                    <NavLink to="/match" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img src={MatchIcon} alt="Match Icon" className="nav-icon" />
                        Match
                    </NavLink>
                    <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img src={ChatIcon} alt="Chat Icon" className="nav-icon" />
                        Chat
                    </NavLink>
                    <NavLink to="/personality" className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img src={TestIcon} alt="Test Icon" className="nav-icon" />
                        Personality tests
                    </NavLink>
                </nav>

                <footer className="footer-side-home">
                    <p className="about-us">© 2025 | About us</p>
                    <div className="social-media">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </footer>
            </aside>

            {!hideProfileButton && (
                <div className="profile-button-container" ref={dropdownRef}>
                    <img
                        src={ProfIcon}
                        alt="Profile"
                        className="profile-image"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                            <a href="#" className="dropdown-item" onClick={handleSignOutClick}>Sign Out</a>
                        </div>
                    )}
                </div>
            )}

            {showConfirmPopup && (
                <ConfirmSignOutPopup onCancel={() => setShowConfirmPopup(false)} />
            )}
        </>
    );
}
