import '../styles/StartPage.css';
import { useNavigate } from 'react-router-dom';
import lineImage from '../assets/Line4.svg';
import startImage from '../assets/start_page_ghosts.png';

export default function StartPage() {
  const navigate = useNavigate();

  const goToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="start-page">
      <div className="left-side">

        <div className="content-wrapper">
          <h1 className="start_page_header">Phantomate</h1>
          <img src={lineImage} alt="background line" className="background-line" />
          <p className="start_page_text">
            Welcome to Phantomate – Your Haunted Hangout for Friendly Spirits!
            Drift into the shadows of the web and discover Phantomate — the spooktacular social platform where you can find friends, chat in real-time, and float through a world of friendly phantoms just like you.
            <br /><br />
            Join Phantomate now and stop haunting alone.
          </p>
          <button className="button_start" onClick={goToSignin}>Start</button>

        </div>

        <footer className="footer_start">
          <p className="about-us">© 2025 | About us</p>
          <div className="social-media">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </footer>
      </div>

      <div className="right-side">
        <img src={startImage} alt="Ghost mates" className="start-image" />
      </div>
    </div>
  );
}
