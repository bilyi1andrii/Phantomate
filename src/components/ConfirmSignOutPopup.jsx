import '../styles/ConfirmSignOutPopup.css';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ConfirmSignOutPopup({ onCancel }) {
    const navigate = useNavigate();

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            console.log('User signed out');
            navigate('/signin');
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <div className="confirm-signout-overlay">
            <div className="confirm-signout-card">
                <h2>Are you sure you want to sign out?</h2>
                <form onSubmit={handleConfirm} className="confirm-signout-form">
                    <div className="confirm-signout-buttons">
                        <button type="submit" className="confirm-button">Yes</button>
                        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
