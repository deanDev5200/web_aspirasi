# Portal Aspirasi

Aplikasi web untuk mengumpulkan dan mengelola aspirasi siswa dengan fitur autentikasi admin dan database MongoDB.

## 🚀 Fitur

- **Form Aspirasi** - Siswa bisa submit aspirasi dengan opsi anonim
- **Dashboard Admin** - Management aspirasi dengan filter dan search
- **Autentikasi** - Login admin yang aman
- **Database** - MongoDB untuk handling data skala besar
- **Responsive Design** - Mobile-friendly dengan Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd web_aspirasi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Start development server
npm run dev
```

## 🗄️ Database Setup

1. Install MongoDB
2. Start MongoDB service
3. Create `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aspirasi_db
   NODE_ENV=development
   ```

## 📁 Project Structure

```
web_aspirasi/
├── src/                   # Frontend React app
│   ├── components/         # Reusable components
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   └── index.css          # Global styles
├── server/                # Backend Express app
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── scripts/         # Utility scripts
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
└── package.json         # Dependencies and scripts
```

## 🔐 Default Credentials

- **Username**: admin
- **Password**: admin123

## 📝 API Endpoints

- `GET /api/aspirasi` - Get all aspirasi with pagination
- `POST /api/aspirasi` - Create new aspirasi
- `PUT /api/aspirasi/:id` - Update aspirasi status
- `DELETE /api/aspirasi/:id` - Delete aspirasi
- `GET /api/aspirasi/stats/overview` - Get statistics

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
npm start
# Set NODE_ENV=production
```

## 📄 License

ISC License
