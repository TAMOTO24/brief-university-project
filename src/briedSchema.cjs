const mongoose = require('mongoose');

const briefSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  projectName: String,
  industry: [String],
  projectType: String,
  projectGoal: String,
  features: [String],
  designStyle: String,
  budget: Number,
  deadline: Date,
}, { timestamps: true });

const Brief = mongoose.models.briefs || mongoose.model('briefs', briefSchema);

module.exports = Brief;
