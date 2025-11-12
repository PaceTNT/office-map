# Office Map Application

A modern web application for managing and displaying office floor plans with employee locations. Users can search for employees, view their locations on interactive maps, and administrators can manage maps, employees, and location data.

## Features

### User Features
- 🗺️ Interactive map viewer with zoom and pan capabilities
- 🔍 Search employees by name, email, or phone number
- 📍 View employee locations on office floor plans
- 👤 Click on employee markers to see detailed information
- 🏢 Browse multiple office locations and floors

### Admin Features
- ➕ Create, edit, and delete office maps
- 👥 Manage employee directory
- 📌 Assign employee desk locations graphically
- 🖼️ Upload floor plan images (JPG/PNG)
- 📊 View all locations and assignments

## Tech Stack

### Backend
- **Node.js** with **Express** - REST API server
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Multer** - File upload handling
- **JWT** - Authentication tokens

### Frontend
- **React** 18 with **TypeScript**
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **React Zoom Pan Pinch** - Map interaction
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker and Docker Compose (optional, for containerized setup)

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd office-map

# Start all services (database, backend, frontend)
docker-compose up

# The application will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# Database: localhost:5432
```

## Manual Setup

### 1. Database Setup

**Option A: Using Docker**
```bash
docker run -d \
  --name officemap-postgres \
  -e POSTGRES_USER=officemap \
  -e POSTGRES_PASSWORD=officemap_dev_password \
  -e POSTGRES_DB=officemap \
  -p 5432:5432 \
  postgres:15-alpine
```

**Option B: Local PostgreSQL**
```sql
CREATE DATABASE officemap;
CREATE USER officemap WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE officemap TO officemap;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/officemap?schema=public"

# Server
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key-change-in-production
DISABLE_AUTH=true  # Set to false for production

# Microsoft SSO (for production)
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
AZURE_AD_REDIRECT_URI=http://localhost:3000/api/auth/callback

# File Upload
UPLOAD_DIR=../uploads
MAX_FILE_SIZE=5242880
```

## Development Mode

By default, authentication is disabled in development mode (`DISABLE_AUTH=true`). This allows you to test the application without setting up SSO. In this mode, you'll have admin privileges automatically.

## Production Deployment

### Deployment Checklist

1. **Set environment variables:**
   - Set `DISABLE_AUTH=false`
   - Configure Microsoft SSO credentials
   - Set secure `JWT_SECRET`
   - Configure production database URL

2. **Build the application:**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd frontend
   npm run build
   ```

3. **Run migrations:**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

4. **Deploy:**
   - Backend: Deploy to Azure App Service, AWS ECS, or similar
   - Frontend: Deploy to Vercel, Netlify, Azure Static Web Apps, or S3+CloudFront
   - Database: Use managed PostgreSQL (Azure Database, AWS RDS, etc.)
   - Storage: Use Azure Blob Storage or AWS S3 for uploaded images

### Recommended Deployment Options

**Option 1: Azure (Best for Microsoft SSO)**
- Frontend: Azure Static Web Apps
- Backend: Azure App Service
- Database: Azure Database for PostgreSQL
- Storage: Azure Blob Storage

**Option 2: AWS**
- Frontend: S3 + CloudFront
- Backend: ECS/Fargate or Elastic Beanstalk
- Database: RDS PostgreSQL
- Storage: S3

**Option 3: Self-hosted**
- Use Docker Compose on a VPS
- Nginx as reverse proxy
- SSL with Let's Encrypt

## API Endpoints

### Maps
- `GET /api/maps` - Get all maps
- `GET /api/maps/:id` - Get map by ID with locations
- `POST /api/maps` - Create new map (Admin)
- `PUT /api/maps/:id` - Update map (Admin)
- `DELETE /api/maps/:id` - Delete map (Admin)

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin)
- `PUT /api/employees/:id` - Update employee (Admin)
- `DELETE /api/employees/:id` - Delete employee (Admin)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations` - Create location (Admin)
- `PUT /api/locations/:id` - Update location (Admin)
- `DELETE /api/locations/:id` - Delete location (Admin)

### Search
- `GET /api/search?query=...` - Search employees

## Database Schema

The application uses four main models:

- **User** - Authentication and roles
- **Map** - Office floor plans
- **Employee** - Employee directory
- **Location** - Employee desk locations (many-to-many between Employee and Map)

Coordinates are stored as normalized floating-point values (0.0 to 1.0), allowing map images to be replaced without updating location data.

## Admin Access

1. Navigate to `/admin` in your browser
2. In development mode (with `DISABLE_AUTH=true`), you'll automatically have admin access
3. In production, ensure your user account has the `ADMIN` role in the database

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb officemap`

### Prisma issues
```bash
cd backend
npx prisma generate  # Regenerate Prisma Client
npx prisma migrate reset  # Reset database (WARNING: deletes all data)
npx prisma studio  # Open database GUI
```

### File upload issues
- Ensure `uploads/` directory exists and is writable
- Check `UPLOAD_DIR` environment variable
- Verify file size is under `MAX_FILE_SIZE`

## Future Enhancements

### Phase 1
- Real-time location updates (WebSocket)
- Desk availability status
- Floor capacity metrics
- PDF/Excel export
- Map layers (exits, amenities)

### Phase 2
- Mobile app (React Native)
- Desk booking system
- Calendar integration
- Slack/Teams integration
- QR codes for desks
- Visitor management

### Phase 3
- Indoor navigation
- Meeting room finder
- Department visualizations
- Occupancy analytics
- Building access integration
- 3D visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.
