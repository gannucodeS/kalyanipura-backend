const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      default: 'Anonymous',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Guidance', 'Healing', 'Comfort', 'Thanksgiving', 'Other'],
        message: 'Invalid prayer category',
      },
    },
    request: {
      type: String,
      required: [true, 'Prayer request is required'],
      trim: true,
      maxlength: [1000, 'Prayer request cannot exceed 1000 characters'],
    },
    requestHi: {
      type: String,
      trim: true,
      maxlength: [1000, 'Hindi translation cannot exceed 1000 characters'],
      default: '',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    prayedCount: {
      type: Number,
      default: 0,
      min: [0, 'Prayed count cannot be negative'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

prayerRequestSchema.index({ isDeleted: 1, isApproved: 1, createdAt: -1 });
prayerRequestSchema.index({ category: 1 });
prayerRequestSchema.index({ prayedCount: -1 });

prayerRequestSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

prayerRequestSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

prayerRequestSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
