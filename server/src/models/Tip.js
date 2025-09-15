const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    // ref: 'User', 
    required: true 
  },
  value: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const commentSchema = new mongoose.Schema({
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  authorName: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const tipSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ["General", "Energy", "Transport", "Home & Garden", "Waste Reduction"],
    required: true,
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  authorName: { 
    type: String, 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  dislikes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  ratings: [ratingSchema],
  comments: [commentSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
tipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for better performance
tipSchema.index({ category: 1, createdAt: -1 });
tipSchema.index({ authorId: 1 });
tipSchema.index({ title: 'text', content: 'text' });

// Update your virtuals to handle non-populated data
tipSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

tipSchema.virtual('dislikeCount').get(function() {
  return this.dislikes ? this.dislikes.length : 0;
});

tipSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

tipSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Ensure virtuals are included in JSON output
tipSchema.set('toJSON', { virtuals: true });
tipSchema.set('toObject', { virtuals: true });

const Tip = mongoose.model("Tip", tipSchema);

module.exports = Tip;