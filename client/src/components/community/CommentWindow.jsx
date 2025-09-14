import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { FaTimes, FaPaperPlane } from 'react-icons/fa';

import "../../pages/Comm/Community.css";

const CommentWindow = ({ tip, isOpen, onClose, onCommentAdded }) => {

 const [comments, setComments] = useState([]);

 const [newComment, setNewComment] = useState('');

 const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {

   if (tip && isOpen) setComments(tip.comments || []);

 }, [tip, isOpen]);

 const handleSubmitComment = async (e) => {

   e.preventDefault();

   if (!newComment.trim()) return;

   setIsSubmitting(true);

   try {

     const res = await axios.post(`http://localhost:5000/tips/${tip._id}/comments`, {

       text: newComment.trim(),

       author: "Anonymous"

     });

     setComments(res.data.comments);

     setNewComment('');

     if (onCommentAdded) onCommentAdded(res.data);

   } catch (error) {

     console.error('Error adding comment:', error);

     alert('Failed to add comment. Please try again.');

   } finally {

     setIsSubmitting(false);

   }

 };

 if (!isOpen || !tip) return null;

 return (

   <div className="overlay">

     <div className="add-card slide-in">

       <div className="comment-header d-flex justify-content-between align-items-center">

         <h3>Comments</h3>

         <button className="btn btn-outline-light" onClick={onClose}>

           <FaTimes />

         </button>

       </div>

       <div className="tip-preview">

         <h4>{tip.tipTitle}</h4>

         <p>{tip.tipDescription}</p>

         <span className="badge-cat">{tip.tipType}</span>

       </div>

       <div className="comments-card">

         <ul className="comment-list">

           {comments.length === 0 ? (

             <p className="no-comments">No comments yet. Be the first!</p>

           ) : (

             comments.map((comment, index) => (

               <li key={index} className="comment-item">

                 <div>

                   <div className="comment-meta">

                     <span className="comment-author">{comment.author}</span> ·{" "}

                     <span>{new Date(comment.createdAt).toLocaleDateString()}</span>

                   </div>

                   <p className="comment-text">{comment.text}</p>

                 </div>

               </li>

             ))

           )}

         </ul>

       </div>

       <form onSubmit={handleSubmitComment} className="comment-form">

         <textarea

           value={newComment}

           onChange={(e) => setNewComment(e.target.value)}

           placeholder="Write your comment..."

           className="comment-input"

           rows="3"

           required

         />

         <button

           type="submit"

           className="btn-eco"

           disabled={isSubmitting || !newComment.trim()}

         >

           <FaPaperPlane /> {isSubmitting ? 'Posting...' : 'Post'}

         </button>

       </form>

     </div>

   </div>

 );

};

export default CommentWindow;