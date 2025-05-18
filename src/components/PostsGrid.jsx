import React, { useState } from "react";
import { deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage, db } from '../config/firebase';

export default function PostsGrid({ posts, username, onDelete }) {
    const [selectedPost, setSelectedPost] = useState(null);


    async function handleDelete(post) {
        try {
            if (post.storagePath) {
                const picRef = ref(storage, post.storagePath);
                await deleteObject(picRef);
            }
            await deleteDoc(doc(db, 'posts', post.id));


            setSelectedPost(null);

            onDelete && onDelete(post.id);
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Couldn’t delete post, please try again.");
        }
    }

    return (
        <>
            <div className="posts-grid">
                {posts.map(post => (
                    <img
                        key={post.id}
                        src={post.imageURL}
                        alt={post.caption}
                        className="post-thumb"
                        onClick={() => setSelectedPost(post)}
                    />
                ))}
            </div>

            {selectedPost && (
                <div className="popup-overlay" onClick={() => setSelectedPost(null)}>
                    <div className="post-profile" onClick={e => e.stopPropagation()}>
                        <div className="post-header-profile">
                            <h2 className="post-username-profile">
                                {username || "User"}
                            </h2>
                        </div>
                        <p className="post-text-profile">
                            {selectedPost.caption}
                        </p>
                        <img
                            src={selectedPost.imageURL}
                            alt={selectedPost.caption}
                            className="post-image-profile"
                        />
                        <button
                            className="close-button"
                            onClick={() => setSelectedPost(null)}
                        >
                            ×
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => handleDelete(selectedPost)}
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}