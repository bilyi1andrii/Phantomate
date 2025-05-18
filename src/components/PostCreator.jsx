import { useState } from 'react';
import '../styles/PostCreator.css';
import { storage } from '../config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../config/firebase'; // Assuming auth is initialized in firebase.js


export default function PostCreator() {
    const [imagePreview, setImagePreview] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const [text, setText] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            const iRef = storageRef(storage, `posts/picures/${Date.now()}_${file.name}`);
            uploadBytes(iRef, file);
            setImgRef(iRef);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const shouldShowPostButton = text.trim() !== '' || imagePreview;

    const handlePost = async(e) => {
        e.preventDefault();
        
        const url = await getDownloadURL(imgRef);

        await addDoc(collection(db, "posts"), {
            imageURL: url,
            caption: text.trim() || null,
            senderId: auth.currentUser.uid,
            timestamp: serverTimestamp()
        });

        setFile(null);
        setUploading(false);
        setShowImageModal(false);
        setImageCaption('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form className="post-creator" onSubmit={handlePost}>
            <input 
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
                    <button className="send-button" type='submit'>Post</button>
                )}
            </div>
        </form>
    );
}
