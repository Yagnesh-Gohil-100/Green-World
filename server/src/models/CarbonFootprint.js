const mongoose = require("mongoose");

const carbonFootprintSchema = new mongoose.Schema(
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
      min: [0, "Transport cannot be negative"],
      max: [1000, "Transport value too high"]
    },
    energy: { 
      type: Number, 
      required: true,
      min: [0, "Energy cannot be negative"],
      max: [500, "Energy value too high"]
    },
    waste: { 
      type: Number, 
      required: true,
      min: [0, "Waste cannot be negative"],
      max: [100, "Waste value too high"]
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Compound index for better query performance
carbonFootprintSchema.index({ userId: 1, userType: 1, date: -1 });
carbonFootprintSchema.index({ date: -1 });

// Virtual for calculated carbon footprint
carbonFootprintSchema.virtual('totalCarbon').get(function() {
  const TRANSPORT_FACTOR = 0.21;
  const ENERGY_FACTOR = 0.475;
  const WASTE_FACTOR = 0.7;
  
  return (
    this.transport * TRANSPORT_FACTOR +
    this.energy * ENERGY_FACTOR +
    this.waste * WASTE_FACTOR
  );
});

module.exports = mongoose.model("CarbonFootprint", carbonFootprintSchema);