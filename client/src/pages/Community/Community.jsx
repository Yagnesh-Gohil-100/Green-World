
import React, { useMemo, useState } from "react";
import {
   FaSearch,
   FaPlus,
   FaLeaf,
   FaThumbsUp,
   FaThumbsDown,
   FaComment,
   FaTrash,
   FaUserCircle,
   FaStar,
   FaRegStar,
   FaTags,
   FaClock,
} from "react-icons/fa";
import "./Community.css";
/* ----------------- utils ----------------- */
const timeAgo = (date) => {
   const dt = new Date(date).getTime();
   const sec = Math.floor((Date.now() - dt) / 1000);
   const m = Math.floor(sec / 60);
   const h = Math.floor(m / 60);
   const d = Math.floor(h / 24);
   if (sec < 60) return `${sec}s ago`;
   if (m < 60) return `${m}m ago`;
   if (h < 24) return `${h}h ago`;
   return `${d}d ago`;
};
/* ----------------- Stars ----------------- */
const Stars = ({ value = 0, onChange, size = 16, ariaLabelPrefix = "Rate" }) => {
   const stars = [1, 2, 3, 4, 5];
   return (
       <div className="stars" role="radiogroup" aria-label="Star rating">
           {stars.map((s) => {
               const filled = value >= s;
               const Icon = filled ? FaStar : FaRegStar;
               return (
                   <button
                       key={s}
                       className="star-btn"
                       type="button"
                       role="radio"
                       aria-checked={filled}
                       aria-label={`${ariaLabelPrefix} ${s} star${s > 1 ? "s" : ""}`}
                       onClick={() => onChange && onChange(s)}
                       title={`${s} / 5`}
                   >
                       <Icon size={size} />
                   </button>
               );
           })}
       </div>
   );
};
/* ----------------- Comments ----------------- */
const Comments = ({ comments = [], onAdd }) => {
   const [text, setText] = useState("");
   return (
       <div>
           <ul className="comment-list">
               {comments.map((c) => (
                   <li key={c.id} className="comment-item">
                       <FaUserCircle className="me-2" />
                       <div>
                           <div className="comment-meta">
                               <strong>{c.authorName}</strong> · <time dateTime={c.createdAt}>{timeAgo(c.createdAt)}</time>
                           </div>
                           <div className="comment-text">{c.text}</div>
                       </div>
                   </li>
               ))}
           </ul>
           <form
               className="comment-form"
               onSubmit={(e) => {
                   e.preventDefault();
                   if (!text.trim()) return;
                   onAdd(text.trim());
                   setText("");
               }}
               aria-label="Add a comment"
           >
               <input
                   className="comment-input"
                   type="text"
                   placeholder="Write a comment..."
                   value={text}
                   onChange={(e) => setText(e.target.value)}
               />
               <button className="btn btn-eco" type="submit">Post</button>
           </form>
       </div>
   );
};
/* ----------------- TipCard ----------------- */
const TipCard = ({ tip, currentUserId, onLike, onDislike, onRate, onAddComment, onDelete }) => {
   const [showComments, setShowComments] = useState(false);
   const avgRating = tip.ratings && tip.ratings.length
       ? tip.ratings.reduce((a, b) => a + b.value, 0) / tip.ratings.length
       : 0;
   const myRating = (tip.ratings || []).find((r) => r.userId === currentUserId)?.value || 0;
   const iLiked = (tip.likes || []).includes(currentUserId);
   const iDisliked = (tip.dislikes || []).includes(currentUserId);
   return (
       <article className="tip-card fade-in" aria-live="polite">
           <header className="tip-header">
               <div className="d-flex align-items-center gap-2">
                   <span className="badge-cat"><FaTags /> {tip.category}</span>
                   <h5 className="mb-0 tip-title">{tip.title}</h5>
               </div>
               <div className="tip-meta">
                   <FaUserCircle className="me-1" />
                   <span className="me-3">{tip.authorName}</span>
                   <FaClock className="me-1" />
                   <time dateTime={tip.createdAt}>{timeAgo(tip.createdAt)}</time>
               </div>
           </header>
           <p className="tip-text">{tip.content}</p>
           <div className="tip-actions">
               <div className="d-flex align-items-center gap-3">
                   <button
                       className={`icon-btn ${iLiked ? "active" : ""}`}
                       type="button"
                       aria-pressed={iLiked}
                       aria-label="Like"
                       onClick={() => onLike(tip.id)}
                       title="Like"
                   >
                       <FaThumbsUp /><span className="count">{(tip.likes || []).length}</span>
                   </button>
                   <button
                       className={`icon-btn ${iDisliked ? "active" : ""}`}
                       type="button"
                       aria-pressed={iDisliked}
                       aria-label="Dislike"
                       onClick={() => onDislike(tip.id)}
                       title="Dislike"
                   >
                       <FaThumbsDown /><span className="count">{(tip.dislikes || []).length}</span>
                   </button>
                   <button
                       className="icon-btn"
                       type="button"
                       aria-expanded={showComments}
                       aria-controls={`comments-${tip.id}`}
                       onClick={() => setShowComments((s) => !s)}
                       title="Comments"
                   >
                       <FaComment /><span className="count">{(tip.comments || []).length}</span>
                   </button>
               </div>
               <div className="d-flex align-items-center gap-2">
                   <Stars value={myRating || Math.round(avgRating)} onChange={(val) => onRate(tip.id, val)} size={18} />
                   <span className="avg">({avgRating.toFixed(1)})</span>
                   {tip.authorId === currentUserId && (
                       <button
                           className="icon-btn danger"
                           type="button"
                           onClick={() => onDelete(tip.id)}
                           aria-label="Delete tip"
                           title="Delete tip"
                       >
                           <FaTrash />
                       </button>
                   )}
               </div>
           </div>
           {showComments && (
               <div id={`comments-${tip.id}`} className="comments-card slide-in" aria-live="polite">
                   <Comments comments={tip.comments || []} onAdd={(text) => onAddComment(tip.id, text)} />
               </div>
           )}
       </article>
   );
};
/* ----------------- Main Community ----------------- */
const Community = ({ currentUser = { id: "u1", name: "EcoSarah" } }) => {
   const [query, setQuery] = useState("");
   const [activeCategory, setActiveCategory] = useState("All Tips");
   const [showAdd, setShowAdd] = useState(false);
   const [tips, setTips] = useState([
       {
           id: "t1",
           title: "Switch to LED Bulbs",
           content:
               "Replace all incandescent bulbs with LED alternatives. LEDs use up to 75% less energy and last 25x longer.",
           category: "Energy",
           authorId: "u1",
           authorName: "EcoSarah",
           createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
           likes: ["u2", "u3"],
           dislikes: [],
           ratings: [{ userId: "u2", value: 4 }, { userId: "u3", value: 5 }],
           comments: [
               {
                   id: "c1",
                   authorName: "GreenCommuter",
                   createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
                   text: "Great starter tip!",
               },
           ],
       },
       {
           id: "t2",
           title: "Bike to Work Challenge",
           content:
               "Try biking to work at least twice a week. Cut 2–6 kg CO₂/week and improve your health.",
           category: "Transport",
           authorId: "u3",
           authorName: "GreenCommuter",
           createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
           likes: ["u1"],
           dislikes: [],
           ratings: [{ userId: "u1", value: 5 }],
           comments: [],
       },
       {
           id: "t3",
           title: "Start Composting at Home",
           content:
               "Create your own compost bin from kitchen scraps and yard waste. Cuts landfill waste and enriches soil.",
           category: "Home & Garden",
           authorId: "u4",
           authorName: "CompostKing",
           createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
           likes: [],
           dislikes: [],
           ratings: [],
           comments: [],
       },
   ]);
   const categories = ["All Tips", "Energy", "Transport", "Home & Garden", "General"];
   const filtered = useMemo(() => {
       const q = query.trim().toLowerCase();
       return tips.filter((t) => {
           const catMatch = activeCategory === "All Tips" || t.category === activeCategory;
           const qMatch =
               q.length === 0 ||
               t.title.toLowerCase().includes(q) ||
               t.content.toLowerCase().includes(q) ||
               t.authorName.toLowerCase().includes(q);
           return catMatch && qMatch;
       });
   }, [tips, query, activeCategory]);
   /* ---------- actions ---------- */
   const handleLike = (id) => {
       setTips((list) =>
           list.map((t) => {
               if (t.id !== id) return t;
               const likes = new Set(t.likes || []);
               const dislikes = new Set(t.dislikes || []);
               if (likes.has(currentUser.id)) {
                   likes.delete(currentUser.id);
               } else {
                   likes.add(currentUser.id);
                   dislikes.delete(currentUser.id);
               }
               return { ...t, likes: [...likes], dislikes: [...dislikes] };
           })
       );
   };
   const handleDislike = (id) => {
       setTips((list) =>
           list.map((t) => {
               if (t.id !== id) return t;
               const likes = new Set(t.likes || []);
               const dislikes = new Set(t.dislikes || []);
               if (dislikes.has(currentUser.id)) {
                   dislikes.delete(currentUser.id);
               } else {
                   dislikes.add(currentUser.id);
                   likes.delete(currentUser.id);
               }
               return { ...t, likes: [...likes], dislikes: [...dislikes] };
           })
       );
   };
   const handleRate = (id, value) => {
       setTips((list) =>
           list.map((t) => {
               if (t.id !== id) return t;
               const others = (t.ratings || []).filter((r) => r.userId !== currentUser.id);
               return { ...t, ratings: [...others, { userId: currentUser.id, value }] };
           })
       );
   };
   const handleAddComment = (id, text) => {
       setTips((list) =>
           list.map((t) =>
               t.id === id
                   ? {
                       ...t,
                       comments: [
                           ...(t.comments || []),
                           {
                               id: `c${Math.random().toString(36).slice(2, 7)}`,
                               authorName: currentUser.name,
                               createdAt: new Date().toISOString(),
                               text,
                           },
                       ],
                   }
                   : t
           )
       );
   };
   const handleDelete = (id) => {
       if (!window.confirm("Delete this tip?")) return;
       setTips((list) => list.filter((t) => t.id !== id));
   };
   /* ---------- add tip form state ---------- */
   const [newTip, setNewTip] = useState({ title: "", content: "", category: "General" });
   const submitNewTip = (e) => {
       e.preventDefault();
       if (!newTip.title.trim() || !newTip.content.trim()) return;
       const tip = {
           id: `t${Math.random().toString(36).slice(2, 7)}`,
           title: newTip.title.trim(),
           content: newTip.content.trim(),
           category: newTip.category,
           authorId: currentUser.id,
           authorName: currentUser.name,
           createdAt: new Date().toISOString(),
           likes: [],
           dislikes: [],
           ratings: [],
           comments: [],
       };
       setTips((list) => [tip, ...list]);
       setShowAdd(false);
       setNewTip({ title: "", content: "", category: "General" });
   };
   return (
       <div className="community-wrap">
           <div className="container py-4">
               <div className="d-flex align-items-center gap-2 mb-2">
                   <FaLeaf className="highlight" />
                   <h2 className="page-title">Community Tips</h2>
               </div>
               <p className="page-subtitle">Share and discover eco-friendly tips from our community</p>
               {/* Search + Add */}
               <div className="toolbar">
                   <div className="search-box">
                       <FaSearch className="search-ico" />
                       <input
                           type="search"
                           placeholder="Search tips..."
                           aria-label="Search tips"
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                       />
                   </div>
                   <button
                       className="btn btn-eco shadow-hover"
                       onClick={() => setShowAdd(true)}
                       aria-label="Add tip"
                   >
                       <FaPlus className="me-2" /> Add Tip
                   </button>
               </div>
               {/* Filters */}
               <div className="chip-row" role="tablist" aria-label="Filter by category">
                   {categories.map((c) => (
                       <button
                           key={c}
                           role="tab"
                           aria-selected={activeCategory === c}
                           className={`chip ${activeCategory === c ? "active" : ""}`}
                           onClick={() => setActiveCategory(c)}
                       >
                           {c}
                       </button>
                   ))}
               </div>
               {/* Tips grid */}
               <div className="row g-4 tips-grid">
                   {filtered.map((tip) => (
                       <div key={tip.id} className="col-12 col-md-6">
                           <TipCard
                               tip={tip}
                               currentUserId={currentUser.id}
                               onLike={handleLike}
                               onDislike={handleDislike}
                               onRate={handleRate}
                               onAddComment={handleAddComment}
                               onDelete={handleDelete}
                           />
                       </div>
                   ))}
                   {filtered.length === 0 && (
                       <div className="col-12">
                           <div className="empty-state fade-in">No tips match your search or filters.</div>
                       </div>
                   )}
               </div>
           </div>
           {/* Add Tip overlay */}
           {showAdd && (
               <div className="overlay" role="dialog" aria-modal="true" aria-label="Add Tip">
                   <div className="add-card pop-in">
                       <h5 className="mb-3">Share Your Eco Tip</h5>
                       <form onSubmit={submitNewTip}>
                           <label className="form-label">Tip title</label>
                           <input
                               className="form-control"
                               type="text"
                               value={newTip.title}
                               onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                               placeholder="e.g., Switch to LED Bulbs"
                               required
                           />
                           <label className="form-label mt-3">Describe your tip in detail</label>
                           <textarea
                               className="form-control"
                               rows="4"
                               value={newTip.content}
                               onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                               placeholder="Add steps, benefits, savings, etc."
                               required
                           />
                           <div className="mt-3">
                               <label className="form-label">Category</label>
                               <select
                                   className="form-select"
                                   value={newTip.category}
                                   onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}
                               >
                                   <option>General</option>
                                   <option>Energy</option>
                                   <option>Transport</option>
                                   <option>Home & Garden</option>
                               </select>
                           </div>
                           <div className="d-flex justify-content-end gap-2 mt-4">
                               <button type="button" className="btn btn-outline-light" onClick={() => setShowAdd(false)}>
                                   Cancel
                               </button>
                               <button type="submit" className="btn btn-eco">
                                   Share Tip
                               </button>
                           </div>
                       </form>
                   </div>
               </div>
           )}
       </div>
   );
};
export default Community;