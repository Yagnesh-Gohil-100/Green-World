const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  organization: {
    type: String,
    required: [true, 'Business name is required'],
    ref: 'Business'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Business ID is required'],
    ref: 'Business'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  profile: {
    carbonFootprint: {
      type: Number,
      default: 0
    },
    sustainabilityScore: {
      type: Number,
      default: 0
    },
    goalsCompleted: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Encrypt password before saving
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
employeeSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for better query performance
employeeSchema.index({ organizationId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ organization: 1 });

module.exports = mongoose.model('Employee', employeeSchema);