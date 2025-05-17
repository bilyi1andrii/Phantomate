import React, { useState } from "react";

export default function PostsGrid({ posts: initialPosts, username }) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);

  function handleDeletePost(id) {
    setPosts(posts.filter(post => post.id !== id));
    setSelectedPost(null);
  }

  return (
    <>
      <div className="posts-grid">
        {posts.map(post => (
          <img
            key={post.id}
            src={post.imageUrl}
            alt={post.title}
            className="post-thumb"
            onClick={() => setSelectedPost(post)}
          />
        ))}
      </div>

      {selectedPost && (
        <div className="popup-overlay" onClick={() => setSelectedPost(null)}>
          <div className="post-profile" onClick={e => e.stopPropagation()}>
            <div className="post-header-profile">
              <h2 className="post-username-profile">{username || "User"}</h2>
            </div>
            <p className="post-text-profile">{selectedPost.description || selectedPost.title}</p>
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="post-image-profile" />
            <button className="close-button" onClick={() => setSelectedPost(null)}>×</button>
            <button 
              className="delete-button" 
              onClick={() => handleDeletePost(selectedPost.id)}
            >
              Delete Post
            </button>
          </div>
        </div>
      )}
    </>
  );
}