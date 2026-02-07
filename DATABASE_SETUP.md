# Portal Aspirasi - Database Setup

## 🚀 Quick Start

### 1. Install MongoDB
- **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

### 2. Start MongoDB
```bash
# Windows (as service)
net start MongoDB

# Mac/Linux
mongod --dbpath /usr/local/var/mongodb  # Mac
sudo systemctl start mongod              # Linux
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

This will start both:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Database Features

### MongoDB Schema
```javascript
{
  nama: String (required),
  kelas: String (default: '-'),
  aspirasi: String (required),
  timestamp: Date (indexed),
  status: Enum['pending', 'reviewed', 'resolved'] (default: 'pending'),
  isAnonymous: Boolean (default: false)
}
```

### API Endpoints
- `GET /api/aspirasi` - Get all aspirasi with pagination, search, filters
- `POST /api/aspirasi` - Create new aspirasi
- `PUT /api/aspirasi/:id` - Update aspirasi status
- `DELETE /api/aspirasi/:id` - Delete aspirasi
- `GET /api/aspirasi/stats/overview` - Get statistics

### Performance Features
- **Text Search**: Full-text search on nama, kelas, aspirasi
- **Date Range Filtering**: Efficient date-based queries
- **Pagination**: Handle large datasets efficiently
- **Indexing**: Optimized for common query patterns

## 🔄 Migration from localStorage

If you have existing data in localStorage:

1. Export your localStorage data:
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('aspirasi') || '[]')
console.log(JSON.stringify(data))
```

2. Run migration script:
```bash
node server/scripts/migrate.js '["your","data","here"]'
```

## 🛠️ Environment Variables

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aspirasi_db
NODE_ENV=development
```

Create `.env.local` for frontend:
```
VITE_API_URL=http://localhost:5000/api
```

## 📈 Scalability

This setup supports:
- **10,000+ records** with pagination
- **Full-text search** across all fields
- **Real-time updates** via API
- **Concurrent users** with proper error handling
- **Data persistence** beyond browser sessions
