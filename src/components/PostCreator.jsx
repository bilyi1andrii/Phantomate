import '../styles/PostCreator.css';

export default function PostCreator() {
    return (
        <div className="post-creator">
            <input type="text" className="post-title" placeholder="Title" />
            <textarea className="post-description" placeholder="Description. Start an interesting conversation or share something wholesome." />
            <div className="post-tools">
                <div className="img-selector">
                    <button className="icon-button">Img</button>
                    <button className="icon-button">GIF</button>
                </div>
                <button className="send-button">➤</button>
            </div>
        </div>
    );
}
