import '../styles/TestPage.css';
import SideBar from '../components/SideBar.jsx';
import BooImage from '../assets/boo.png';

export default function PersonalityTestPage() {
    return (
        <div className="personality-page">
            <SideBar />
            <main className="personality-content">
                <div className="intro-section">
                    <div className="intro-text">
                        <h1>16 personality test.<br />Discover who you are.</h1>
                        <p>
                            The 16 Personality Test is more than just a label — it’s a mirror to your spirit.
                            It's not about putting you in a box. It's about getting out—the one you’ve carried inside all along.
                            Answer a few questions. Uncover your type. Begin understanding yourself — and the people you're drawn to —
                            on a whole new level.
                        </p>
                        <button className="take-test-btn">Take test</button>
                    </div>
                    <img src={BooImage} alt="Ghost Boo" className="boo-image" />
                </div>

                <div className="questionnaire">
                    {[
                        "Do you enjoy sneaking around silently, observing others without being noticed?",
                        "Do you often feel like you're in the wrong place... or even the wrong century?",
                        "Do you find comfort in the night and feel most energized when the world is quiet?"
                    ].map((question, i) => (
                        <div className="question-block" key={i}>
                            <p className="question-text">{question}</p>
                            <div className="options">
                                <span>No</span>
                                {[...Array(5)].map((_, j) => (
                                    <label key={j} className="option-circle">
                                        <input type="radio" name={`q${i}`} />
                                        <span className="checkmark" />
                                    </label>
                                ))}
                                <span>Yes</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
