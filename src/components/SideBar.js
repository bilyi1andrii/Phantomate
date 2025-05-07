import { NavLink } from 'react-router-dom';
import LogoIcon from '../assets/logo-icon.png';
import HomeIcon from '../assets/home-icon.png';
import MatchIcon from '../assets/match-icon.png';
import ChatIcon from '../assets/chat-icon.png';
import TestIcon from '../assets/test-icon.png';
import ProfIcon from '../assets/profile-icon.png';
import '../styles/Sidebar.css';


export default function Sidebar({ hideProfileButton = false }) {
    return (
        <>
            <aside className="sidebar">
                <div className="logo">
                    <img src={LogoIcon} alt="Logo" className="logo-icon" />
                    <h1 className="logo-text">Phantomate</h1>
                </div>

                <nav className="nav-links">
                    <NavLink to="/home" className="nav-link" activeClassName="nav-link-active">
                        <img src={HomeIcon} alt="Home Icon" className="nav-icon" />
                        Home
                    </NavLink>
                    <NavLink to="/match" className="nav-link" activeClassName="nav-link-active">
                        <img src={MatchIcon} alt="Match Icon" className="nav-icon" />
                        Match
                    </NavLink>
                    <NavLink to="/chat" className="nav-link" activeClassName="nav-link-active">
                        <img src={ChatIcon} alt="Chat Icon" className="nav-icon" />
                        Chat
                    </NavLink>
                    <NavLink to="/personality" className="nav-link" activeClassName="nav-link-active">
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
                <div className="profile-button-container">
                    <a href="/profile">
                        <img src={ProfIcon} alt="Profile" className="profile-image" />
                    </a>
                </div>
            )}
        </>
    );
}
