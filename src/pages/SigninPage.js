import '../styles/SigninPage.css';
import React from 'react';
import SignInImage from '../assets/signin_image.svg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SigninPage() {
    const navigate = useNavigate();

    const goToHome = () => {
       navigate('/home');
    };

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    function handleUsername(event){
        setUsername(event.target.value);
    }

    function handlePassword(event){
        setPassword(event.target.value);
    }

    function handleSignIn(event){
        if (username){ // in database
            //check passsword in database
            goToHome();
        } 
    }

    return (
        <div className="sign-in-page">
            <div className="signin-content">
                <div className="image-side">
                    <img src={SignInImage} alt="Ghost mates" className="signin-image" />
                </div>
                <form className="signin-form">
                    <h1 className="signin_header">Sign In</h1>
                    <div className="input-container">
                        <input type="text" id="username_input" name="username" value={username}
                        onChange={handleUsername} required className="input-field" 
                        placeholder="Enter your username" />
                    </div>

                    <div className="input-container">
                        <input type="password" id="password_input" name="password" value={password}
                        onChange={handlePassword} required className="input-field" 
                        placeholder="Enter your password" />
                    </div>
                    <p className="signup-prompt">
                        <Link to="/signup" className="signup-link">Not on Phantomate yet? Sign up</Link>
                    </p>
                    <button className="button_signin" type="submit" onClick={handleSignIn}>Sign In</button>
                </form>
            </div>
            <footer className="footer_signin">
                <p className="about-us">© 2025 | About us</p>
                <div className="social-media">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </footer>
        </div>
    );
}