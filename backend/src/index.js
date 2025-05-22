require('dotenv').config();
const { createConnection } = require('typeorm');
const app = require('./app');

// Database configuration
const connectDB = async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'access_management',
      entities: [
        require('./entities/User'),
        require('./entities/Software'),
        require('./entities/Request')
      ],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-creates database schema (not for production)
      logging: process.env.NODE_ENV === 'development'
    });
    
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Then start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});