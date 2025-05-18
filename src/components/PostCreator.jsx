import { useState, useRef } from 'react';
import '../styles/PostCreator.css';
import { storage } from '../config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';

export default function PostCreator({ me }) {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imgRef, setImgRef] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        const iRef = storageRef(storage, `posts/pictures/${Date.now()}_${file.name}`);
        await uploadBytes(iRef, file);
        setImgRef(iRef);
    };

    const handlePost = async e => {
        e.preventDefault();
        if (!me) return;
        if (!imgRef) {
            alert("Please add an image before posting!");
            return;
        }
        const imageURL = imgRef ? await getDownloadURL(imgRef) : null;
        const storagePath = imgRef ? imgRef.fullPath : null;

        await addDoc(collection(db, "posts"), {
            imageURL,
            storagePath,
            caption: text.trim() || null,
            author: doc(db, 'users', auth.currentUser.uid),
            timestamp: serverTimestamp()
        });

        setText('');
        setImagePreview(null);
        setImgRef(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const canPost = !!imgRef;

    return (
        <form className="post-creator" onSubmit={handlePost}>
            <textarea
                className="post-description"
                placeholder="Description. Start an interesting conversation or share something wholesome."
                value={text}
                onChange={e => setText(e.target.value)}
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="post-image" />}
            <div className="post-tools">
                <label className="image-upload-post">
                    Img
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </label>
                <button
                    className="send-button"
                    type="submit"
                    disabled={!canPost}
                    style={{ opacity: canPost ? 1 : 0.5, cursor: canPost ? 'pointer' : 'not-allowed' }}
                >
                    Post
                </button>
            </div>
        </form>
    );
}
