const mongoose = require('mongoose');

const ministrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    iconName: {
      type: String,
      required: [true, 'Icon name is required'],
      enum: {
        values: ['smile', 'users', 'heart'],
        message: 'Icon must be one of: smile, users, heart',
      },
    },
    detailedDescription: {
      type: String,
      required: [true, 'Detailed description is required'],
      trim: true,
      maxlength: [2000, 'Detailed description cannot exceed 2000 characters'],
    },
    meetingTimes: {
      type: String,
      required: [true, 'Meeting times are required'],
      trim: true,
      maxlength: [300, 'Meeting times cannot exceed 300 characters'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    volunteerNeeds: {
      type: String,
      trim: true,
      maxlength: [500, 'Volunteer needs cannot exceed 500 characters'],
      default: '',
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

ministrySchema.index({ isDeleted: 1, createdAt: -1 });
ministrySchema.index({ iconName: 1 });

ministrySchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

ministrySchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

ministrySchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('Ministry', ministrySchema);
