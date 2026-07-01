const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, 'Day is required'],
      trim: true,
      maxlength: [2, 'Day cannot exceed 2 characters'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true,
      maxlength: [3, 'Month cannot exceed 3 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
      maxlength: [100, 'Time cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    titleHi: { type: String, trim: true, default: '' },
    timeHi: { type: String, trim: true, default: '' },
    locationHi: { type: String, trim: true, default: '' },
    descriptionHi: { type: String, trim: true, default: '' },
    rsvpCount: {
      type: Number,
      default: 0,
      min: [0, 'RSVP count cannot be negative'],
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

eventSchema.index({ isDeleted: 1, createdAt: -1 });
eventSchema.index({ month: 1 });

eventSchema.virtual('rsvps', {
  ref: 'EventRsvp',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

eventSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

eventSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

eventSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
