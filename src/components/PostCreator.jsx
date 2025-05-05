import { useState } from 'react';
import '../styles/PostCreator.css';

export default function PostCreator() {
    const [imagePreview, setImagePreview] = useState(null);
    const [text, setText] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const shouldShowPostButton = text.trim() !== '' || imagePreview;

    return (
        <div className="post-creator">
            <textarea
                className="post-description"
                placeholder="Description. Start an interesting conversation or share something wholesome."
                value={text}
                onChange={handleTextChange}
            />
            
            {imagePreview && (
                <img src={imagePreview} alt="Preview" className="post-image" />
            )}

            <div className="post-tools">
                <div className="img-selector">
                    <label className="image-upload-post">
                        Img
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </label>
                    <label className="gif-upload-post">
                        GIF
                        <input type="file" accept="image/*" style={{ display: 'none' }} />
                    </label>
                </div>

                {shouldShowPostButton && (
                    <button className="send-button">Post</button>
                )}
            </div>
        </div>
    );
}
