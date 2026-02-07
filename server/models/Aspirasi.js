const mongoose = require('mongoose')

const aspirasiSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    trim: true
  },
  kelas: {
    type: String,
    default: '-',
    trim: true
  },
  aspirasi: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Index untuk optimasi pencarian
aspirasiSchema.index({ nama: 'text', kelas: 'text', aspirasi: 'text' })
aspirasiSchema.index({ timestamp: -1 })

// Virtual untuk formatted date
aspirasiSchema.virtual('formattedDate').get(function() {
  return this.timestamp.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

module.exports = mongoose.model('Aspirasi', aspirasiSchema)
