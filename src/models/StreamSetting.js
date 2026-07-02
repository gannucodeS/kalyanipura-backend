const mongoose = require('mongoose');

const streamSettingSchema = new mongoose.Schema(
  {
    youtubeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    churchPlatformUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    serviceTimes: {
      type: String,
      trim: true,
      default: 'Sunday services at 9:00 AM & 11:00 AM',
    },
    serviceTimesHi: {
      type: String,
      trim: true,
      default: 'रविवार सेवाएं सुबह 9:00 बजे और 11:00 बजे',
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

streamSettingSchema.index({ isDeleted: 1 });

streamSettingSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
});

streamSettingSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

streamSettingSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('StreamSetting', streamSettingSchema);