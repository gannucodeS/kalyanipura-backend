const mongoose = require('mongoose');

const ministryInterestSchema = new mongoose.Schema(
  {
    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ministry',
      required: [true, 'Ministry ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ministryInterestSchema.index({ ministry: 1, createdAt: -1 });
ministryInterestSchema.index({ email: 1 });

module.exports = mongoose.model('MinistryInterest', ministryInterestSchema);
