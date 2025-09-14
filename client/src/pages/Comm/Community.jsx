import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLeaf, FaPlus, FaSearch } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';

import Form from "../../components/community/Form";
import CategoryFilter from '../../components/community/CategoryFilter'
import Tipscards from "../../components/community/Tipscards";
import "./Community.css";

const Community = () => {
  const { currentUser, userType } = useAuth();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tips");
  const [showAdd, setShowAdd] = useState(false);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Fetch tips from backend ----------
  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/community/tips";
        const params = {};
        
        if (activeCategory !== "All Tips") params.category = activeCategory;
        if (query.trim()) params.search = query;

        const res = await axios.get(url, { params });
        setTips(res.data.tips || res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching tips:", err.message);
        setError("Failed to load community tips");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [activeCategory, query]);

  // ---------- Actions ----------
  const handleLike = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/community/tips/${id}/like`);
      setTips((list) => list.map((t) => (t._id === id ? res.data.tip : t)));
    } catch (err) {
      console.error("Error liking tip:", err.message);
      alert("Failed to like tip");
    }
  };

  const handleDislike = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/community/tips/${id}/dislike`);
      setTips((list) => list.map((t) => (t._id === id ? res.data.tip : t)));
    } catch (err) {
      console.error("Error disliking tip:", err.message);
      alert("Failed to dislike tip");
    }
  };

  const handleRate = async (id, value) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/community/tips/${id}/rating`, {
        value,
      });
      setTips((list) => list.map((t) => (t._id === id ? res.data.tip : t)));
    } catch (err) {
      console.error("Error rating tip:", err.message);
      alert("Failed to rate tip");
    }
  };

  const handleAddComment = async (id, text) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/community/tips/${id}/comments`, {
        text,
      });
      setTips((list) => list.map((t) => (t._id === id ? res.data.tip : t)));
    } catch (err) {
      console.error("Error adding comment:", err.message);
      alert("Failed to add comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tip?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/community/tips/${id}`);
      setTips((list) => list.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting tip:", err.message);
      alert("Failed to delete tip");
    }
  };

  const handleSubmitTip = async (newTip) => {
    try {
      const res = await axios.post("http://localhost:5000/api/community/tips", newTip);
      setTips((list) => [res.data.tip, ...list]);
      setShowAdd(false);
    } catch (err) {
      console.error("Error submitting tip:", err.message);
      alert("Failed to submit tip");
    }
  };

  // ---------- UI ----------
  const categories = ["All Tips", "Energy", "Transport", "Home & Garden", "Food", "Shopping", "General"];

  if (loading) {
    return (
      <div className="community-wrap">
        <div className="container py-4 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading community tips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="community-wrap">
      <div className="container py-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <FaLeaf className="highlight" />
          <h2 className="page-title">Eco Community</h2>
        </div>
        
        <p className="page-subtitle">
          Share and discover eco-friendly tips with our sustainable community
        </p>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        {/* Toolbar with Search + Add */}
        <div className="toolbar">
          <div className="search-box">
            <FaSearch className="search-ico" />
            <input
              type="search"
              placeholder="Search tips..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <button 
            className="btn btn-eco glass" 
            onClick={() => setShowAdd(true)}
            disabled={!currentUser}
          >
            <FaPlus className="me-2" /> 
            {currentUser ? "Add Tip" : "Sign in to Add Tip"}
          </button>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Tips List */}
        <Tipscards
          tips={tips}
          currentUser={currentUser}
          onLike={handleLike}
          onDislike={handleDislike}
          onRate={handleRate}
          onAddComment={handleAddComment}
          onDelete={handleDelete}
        />

        {tips.length === 0 && !loading && (
          <div className="empty-state fade-in">
            {query || activeCategory !== "All Tips" 
              ? "No tips match your search or filters." 
              : "No tips yet. Be the first to share!"
            }
          </div>
        )}
      </div>

      {/* Overlay Add Tip */}
      {showAdd && (
        <div className="overlay">
          <Form 
            onSubmitTip={handleSubmitTip} 
            onCancel={() => setShowAdd(false)}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Login Prompt for non-authenticated users */}
      {!currentUser && (
        <div className="alert alert-info mt-4">
          <strong>Join the conversation!</strong> Sign in to like, comment, and share your own eco-tips.
        </div>
      )}
    </div>
  );
};

export default Community;