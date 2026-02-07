const express = require('express')
const router = express.Router()
const Aspirasi = require('../models/Aspirasi')

// GET all aspirasi
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, startDate, endDate, status } = req.query
    
    // Build query
    const query = {}
    
    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate + 'T23:59:59.999Z')
    }
    
    // Status filter
    if (status) {
      query.status = status
    }
    
    const skip = (page - 1) * limit
    
    const [aspirasi, total] = await Promise.all([
      Aspirasi.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Aspirasi.countDocuments(query)
    ])
    
    res.json({
      data: aspirasi,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET single aspirasi by ID
router.get('/:id', async (req, res) => {
  try {
    const aspirasi = await Aspirasi.findById(req.params.id)
    if (!aspirasi) {
      return res.status(404).json({ error: 'Aspirasi not found' })
    }
    res.json(aspirasi)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST new aspirasi
router.post('/', async (req, res) => {
  try {
    const { nama, kelas, aspirasi, isAnonymous } = req.body
    
    // Validation
    if (!nama || !aspirasi) {
      return res.status(400).json({ error: 'Nama dan aspirasi harus diisi' })
    }
    
    const newAspirasi = new Aspirasi({
      nama: isAnonymous ? 'Anonim' : nama,
      kelas: isAnonymous ? '-' : (kelas || '-'),
      aspirasi,
      isAnonymous: isAnonymous || false
    })
    
    const savedAspirasi = await newAspirasi.save()
    res.status(201).json(savedAspirasi)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT update aspirasi status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body
    
    if (status && !['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    
    const updatedAspirasi = await Aspirasi.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    
    if (!updatedAspirasi) {
      return res.status(404).json({ error: 'Aspirasi not found' })
    }
    
    res.json(updatedAspirasi)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE aspirasi
router.delete('/:id', async (req, res) => {
  try {
    const deletedAspirasi = await Aspirasi.findByIdAndDelete(req.params.id)
    
    if (!deletedAspirasi) {
      return res.status(404).json({ error: 'Aspirasi not found' })
    }
    
    res.json({ message: 'Aspirasi deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Promise.all([
      Aspirasi.countDocuments(),
      Aspirasi.countDocuments({ status: 'pending' }),
      Aspirasi.countDocuments({ status: 'reviewed' }),
      Aspirasi.countDocuments({ status: 'resolved' }),
      Aspirasi.countDocuments({ isAnonymous: true })
    ])
    
    res.json({
      total: stats[0],
      pending: stats[1],
      reviewed: stats[2],
      resolved: stats[3],
      anonymous: stats[4]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
