import '../styles/ConfirmSignOutPopup.css';
import { useNavigate } from 'react-router-dom';

export default function ConfirmSignOutPopup({ onCancel }) {
    const navigate = useNavigate();

    const handleConfirm = (e) => {
        console.log('User signed out');
        navigate('/signin');
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
