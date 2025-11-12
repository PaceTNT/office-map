import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mapRoutes from './routes/mapRoutes';
import employeeRoutes from './routes/employeeRoutes';
import locationRoutes from './routes/locationRoutes';
import searchRoutes from './routes/searchRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || '../uploads');
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/maps', mapRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/search', searchRoutes);

// Auth status endpoint
app.get('/api/auth/status', (req, res) => {
  const authDisabled = process.env.DISABLE_AUTH === 'true';
  res.json({
    authEnabled: !authDisabled,
    mode: authDisabled ? 'development' : 'production',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth disabled: ${process.env.DISABLE_AUTH === 'true' ? 'Yes' : 'No'}`);
});
