import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import uploadRoutes from './routes/upload.js';
import usersRoutes from './routes/users.js';


import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';
import { notfound } from './middlewares/notfound.js';
import { swaggerSpec } from './utils/swagger.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


//  middlewares

app.use(express.json())
app.use(cors(
    {
        origin: ["http://localhost:5173"]
    }
))


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))  // to log HTTP requests
}

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running 🚀' });
});

// Server frontend in production
if(process.env.NODE_ENV === "production") {
    const __dirname  = path.dirname(fileURLToPath(import.meta.url));

    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // server the frontend app
     app.get(/.*/, (req, res) => {
        res.send(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    })
}

// Error handling
app.use(notfound)
app.use(errorHandler)



// Connect to MongoDB
mongoose.connect(process.env.NODE_ENV === "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRO)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ Connection error:', err));




app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})