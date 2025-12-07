const mongoose = require('mongoose');

const WebsiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  tags: [
    {
      type: String
    }
  ],
  favicon: {
    type: String
  },
  thumbnail: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 索引，提高查询性能
WebsiteSchema.index({ title: 'text', description: 'text', tags: 'text' });
WebsiteSchema.index({ category: 1 });
WebsiteSchema.index({ creator: 1 });

module.exports = mongoose.model('Website', WebsiteSchema);