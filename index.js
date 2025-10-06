import express from 'express';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';


import dotenv from 'dotenv';
import { notfound } from './middlewares/notfound.js';
import { errorHandler } from './middlewares/errorHandler.js';



dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;


//  middlewares

app.use(express.json())
app.use(cors(
    {
        origin: ["http://localhost:5879", "http://localhost:dugsiye.com"]
    }
))


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))  // to log HTTP requests
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/upload', uploadRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is running 🚀' });
});


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