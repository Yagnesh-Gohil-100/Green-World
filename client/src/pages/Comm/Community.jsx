import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLeaf, FaPlus, FaSearch, FaSync } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';

import Form from "../../components/community/Form";
import CategoryFilter from '../../components/community/CategoryFilter';
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

  // Get axios instance with auth headers
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  // ---------- Fetch tips from backend ----------
  const fetchTips = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const url = "/community/tips";
      const params = {};
      
      if (activeCategory !== "All Tips") params.category = activeCategory;
      if (query.trim()) params.search = query;

      const res = await authAxios.get(url, { params });
      // Updated to use res.data.data instead of res.data.tips
      setTips(res.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching tips:", err);
      setError("Failed to load community tips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [activeCategory, query]);

  // ---------- Actions ----------
  const handleLike = async (id) => {
    if (!currentUser) {
      alert("Please sign in to like tips");
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.put(`/community/tips/${id}/like`);
      // Updated to use res.data.data instead of res.data.tip
      setTips((list) => list.map((t) => (t._id === id ? res.data.data : t)));
    } catch (err) {
      console.error("Error liking tip:", err);
      alert(err.response?.data?.error || "Failed to like tip");
    }
  };

  const handleDislike = async (id) => {
    if (!currentUser) {
      alert("Please sign in to dislike tips");
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.put(`/community/tips/${id}/dislike`);
      // Updated to use res.data.data instead of res.data.tip
      setTips((list) => list.map((t) => (t._id === id ? res.data.data : t)));
    } catch (err) {
      console.error("Error disliking tip:", err);
      alert(err.response?.data?.error || "Failed to dislike tip");
    }
  };

  const handleRate = async (id, value) => {
    if (!currentUser) {
      alert("Please sign in to rate tips");
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.put(`/community/tips/${id}/rating`, { value });
      // Updated to use res.data.data instead of res.data.tip
      setTips((list) => list.map((t) => (t._id === id ? res.data.data : t)));
    } catch (err) {
      console.error("Error rating tip:", err);
      alert(err.response?.data?.error || "Failed to rate tip");
    }
  };

  const handleAddComment = async (id, text) => {
    if (!currentUser) {
      alert("Please sign in to add comments");
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post(`/community/tips/${id}/comments`, { text });
      // Updated to use res.data.data instead of res.data.tip
      setTips((list) => list.map((t) => (t._id === id ? res.data.data : t)));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.response?.data?.error || "Failed to add comment");
    }
  };

  const handleDelete = async (id) => {
    if (!currentUser) {
      alert("Please sign in to delete tips");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this tip?")) return;
    
    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`/community/tips/${id}`);
      setTips((list) => list.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting tip:", err);
      alert(err.response?.data?.error || "Failed to delete tip");
    }
  };

  const handleSubmitTip = async (newTip) => {
    if (!currentUser) {
      alert("Please sign in to submit tips");
      return;
    }

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.post("/community/tips", newTip);
      // Updated to use res.data.data instead of res.data.tip
      setTips((list) => [res.data.data, ...list]);
      setShowAdd(false);
    } catch (err) {
      console.error("Error submitting tip:", err);
      alert(err.response?.data?.error || "Failed to submit tip");
    }
  };

  // Refresh tips
  const handleRefresh = () => {
    fetchTips();
  };

  // ---------- UI ----------
  const categories = ["All Tips", "Energy", "Transport", "Home & Garden", "General"];

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
          <button 
            className="btn btn-outline-success btn-sm ms-2"
            onClick={handleRefresh}
            title="Refresh tips"
          >
            <FaSync />
          </button>
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