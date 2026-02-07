const Aspirasi = require('../models/Aspirasi')

// Migration script to move localStorage data to MongoDB
const migrateFromLocalStorage = async () => {
  try {
    console.log('Starting migration from localStorage...')
    
    // Get data from localStorage simulation (in production, this would come from a backup)
    const localStorageData = process.argv[2] ? JSON.parse(process.argv[2]) : []
    
    if (localStorageData.length === 0) {
      console.log('No data to migrate')
      return
    }
    
    console.log(`Found ${localStorageData.length} items to migrate`)
    
    let migrated = 0
    let skipped = 0
    
    for (const item of localStorageData) {
      try {
        // Check if already exists
        const existing = await Aspirasi.findOne({
          nama: item.nama,
          aspirasi: item.aspirasi,
          timestamp: new Date(item.timestamp)
        })
        
        if (existing) {
          skipped++
          continue
        }
        
        // Create new document
        const aspirasi = new Aspirasi({
          nama: item.nama,
          kelas: item.kelas || '-',
          aspirasi: item.aspirasi,
          timestamp: new Date(item.timestamp),
          isAnonymous: item.nama === 'Anonim',
          status: 'pending'
        })
        
        await aspirasi.save()
        migrated++
        
      } catch (error) {
        console.error(`Error migrating item: ${error.message}`)
      }
    }
    
    console.log(`Migration completed: ${migrated} migrated, ${skipped} skipped`)
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run if called directly
if (require.main === module) {
  migrateFromLocalStorage().then(() => {
    process.exit(0)
  })
}

module.exports = migrateFromLocalStorage
