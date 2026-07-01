const mongoose = require('mongoose');

const serviceTimeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
      maxlength: [100, 'Time cannot exceed 100 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      enum: {
        values: ['sun', 'moon', 'users'],
        message: 'Icon must be one of: sun, moon, users',
      },
    },
    titleHi: { type: String, trim: true, default: '' },
    timeHi: { type: String, trim: true, default: '' },
    taglineHi: { type: String, trim: true, default: '' },
    categoryHi: { type: String, trim: true, default: '' },
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

serviceTimeSchema.index({ isDeleted: 1, createdAt: -1 });
serviceTimeSchema.index({ icon: 1 });

serviceTimeSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

serviceTimeSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

serviceTimeSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('ServiceTime', serviceTimeSchema);
