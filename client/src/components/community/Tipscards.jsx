import React, { useState } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaTrash,
  FaUserCircle,
  FaTags,
  FaClock,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import '../../pages/Comm/Community.css';
import { formatTimeAgo } from '../../utils/timeUtils';

const Stars = ({ value = 0, onChange, readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="stars">
      {stars.map((s) => {
        const filled = value >= s;
        const Icon = filled ? FaStar : FaRegStar;
        return (
          <button
            key={s}
            className={`star-btn ${readonly ? 'readonly' : ''}`}
            type="button"
            onClick={() => !readonly && onChange && onChange(s)}
            disabled={readonly}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
};

const Comments = ({ comments = [], onAdd, currentUser }) => {
  const [text, setText] = useState("");

  return (
    <div className="comments-card slide-in">
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id || c._id} className="comment-item">
            <FaUserCircle className="me-2" />
            <div>
              <div className="comment-meta">
                <strong>{c.authorName}</strong> ·{" "}
                <time>{formatTimeAgo(c.createdAt)}</time>
              </div>
              <div className="comment-text">{c.text}</div>
            </div>
          </li>
        ))}
      </ul>
      
      {currentUser ? (
        <form
          className="comment-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onAdd(text.trim());
            setText("");
          }}
        >
          <input
            className="comment-input"
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-eco" type="submit">
            Post
          </button>
        </form>
      ) : (
        <p className="text-muted text-center p-2">
          Sign in to add a comment
        </p>
      )}
    </div>
  );
};

const Tipscards = ({
  tips,
  currentUser,
  onLike,
  onDislike,
  onRate,
  onAddComment,
  onDelete,
}) => {
  const [openComments, setOpenComments] = useState(null);

  return (
    <div className="row g-4 tips-grid">
      {tips.map((tip) => {
        const avgRating =
          tip.ratings && tip.ratings.length
            ? tip.ratings.reduce((a, b) => a + b.value, 0) / tip.ratings.length
            : 0;

        const myRating =
          (tip.ratings || []).find((r) => r.userId === currentUser?.id)?.value || 0;

        const iLiked = (tip.likes || []).includes(currentUser?.id);
        const iDisliked = (tip.dislikes || []).includes(currentUser?.id);

        const canInteract = !!currentUser; // Check if user is logged in
        const isAuthor = currentUser && tip.authorId === currentUser.id;

        return (
          <div key={tip._id} className="col-12 col-lg-5 col-md-6">
            <article className="tip-card fade-in">
              <header className="tip-header">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-cat">
                    <FaTags /> {tip.category}
                  </span>
                  <h5 className="tip-title">{tip.title}</h5>
                </div>
                <div className="tip-meta">
                  <FaUserCircle /> <span className="me-3">{tip.authorName}</span>
                  <FaClock /> <time>{formatTimeAgo(tip.createdAt)}</time>
                </div>
              </header>

              <p className="tip-text">{tip.content}</p>

              <div className="tip-actions">
                <div className="d-flex align-items-center gap-3">
                  <button
                    className={`icon-btn ${iLiked ? "active" : ""} ${!canInteract ? 'disabled' : ''}`}
                    onClick={() => canInteract && onLike(tip._id)}
                    disabled={!canInteract}
                    title={!canInteract ? "Sign in to like" : ""}
                  >
                    <FaThumbsUp />{" "}
                    <span className="count">{(tip.likes || []).length}</span>
                  </button>
                  
                  <button
                    className={`icon-btn ${iDisliked ? "active" : ""} ${!canInteract ? 'disabled' : ''}`}
                    onClick={() => canInteract && onDislike(tip._id)}
                    disabled={!canInteract}
                    title={!canInteract ? "Sign in to dislike" : ""}
                  >
                    <FaThumbsDown />{" "}
                    <span className="count">{(tip.dislikes || []).length}</span>
                  </button>
                  
                  <button
                    className="icon-btn"
                    onClick={() => setOpenComments(openComments === tip._id ? null : tip._id)}
                  >
                    <FaComment />{" "}
                    <span className="count">{(tip.comments || []).length}</span>
                  </button>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <Stars
                    value={myRating || Math.round(avgRating)}
                    onChange={(val) => onRate(tip._id, val)}
                    readonly={!canInteract}
                  />
                  <span className="avg">({avgRating.toFixed(1)})</span>
                  
                  {isAuthor && (
                    <button
                      className="icon-btn danger"
                      onClick={() => onDelete(tip._id)}
                      title="Delete tip"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>

              {openComments === tip._id && (
                <Comments
                  comments={tip.comments || []}
                  onAdd={(text) => onAddComment(tip._id, text)}
                  currentUser={currentUser}
                />
              )}
            </article>
          </div>
        );
      })}
    </div>
  );
};

export default Tipscards;