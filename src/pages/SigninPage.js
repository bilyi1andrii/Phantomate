import '../styles/SigninPage.css';
import SignInImage from '../assets/signin_image.svg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SigninPage() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };
    return (
        <div className="sign-in-page">
            <div className="signin-content">
                <div className="image-side">
                    <img src={SignInImage} alt="Ghost mates" className="signin-image" />
                </div>
                <form className="signin-form">
                    <h1 className="signin_header">Sign In</h1>
                    <div className="input-container">
                        <input type="text" id="username_input" name="username" required className="input-field" placeholder="Enter your username" />
                    </div>

                    <div className="input-container">
                        <input type="password" id="password_input" name="password" required className="input-field" placeholder="Enter your password" />
                    </div>
                    <p className="signup-prompt">
                        <Link to="/signup" className="signup-link">Not on Phantomate yet? Sign up</Link>
                    </p>
                    <button className="button_signin" type="submit" onClick={goToHome}>Sign In</button>
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