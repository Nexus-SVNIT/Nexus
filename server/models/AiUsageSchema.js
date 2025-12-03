const mongoose = require('mongoose');
const { Schema } = mongoose;

const AiUsageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // UTC day key, e.g., "2025-09-02"
    date: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure one document per user per day
AiUsageSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AiUsage', AiUsageSchema);