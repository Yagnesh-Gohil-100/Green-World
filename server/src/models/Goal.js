const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userType'
    },
    userType: {
      type: String,
      required: true,
      enum: ['PersonalUser', 'Business', 'Employee']
    },
    transport: { 
      type: Number, 
      required: true,
      min: [50, "Transport must be at least 50 km"],
      max: [500, "Transport cannot exceed 500 km"]
    },
    energy: { 
      type: Number, 
      required: true,
      min: [50, "Energy must be at least 50 kWh"],
      max: [400, "Energy cannot exceed 400 kWh"]
    },
    waste: { 
      type: Number, 
      required: true,
      min: [10, "Waste must be at least 10 kg"],
      max: [150, "Waste cannot exceed 150 kg"]
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Index for better query performance
goalSchema.index({ userId: 1, userType: 1 });
goalSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Goal", goalSchema);