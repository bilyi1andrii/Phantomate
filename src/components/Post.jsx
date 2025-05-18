function Post({ username, caption, imageURL, avatarURL }) {
    return (
        <div className="post">
            <h2>{username}</h2>
            <div className="post-header">
                <img src={avatarURL} alt="Avatar" className="post-avatar" />
                <h2 className="post-username">{username}</h2>
            </div>
            <p className="post-text">{caption}</p>
            {imageURL && <img src={imageURL} alt="Post" className="post-image" />}
        </div>
    );
}

export default Post;