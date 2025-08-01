import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './config/dB.js';

import bannerRouter from './routes/BannerRouter.js';
import industrialRouter from "./routes/IndustrialRouter.js" 
import testimonialRouter from './routes/TestimonialRouter.js';
import storyRouter from './routes/StoryRouter.js';

import facilitiesRouter from './routes/FacilitiesRouter.js';
import ourTeamRouter from './routes/OurTeamRouter.js';
import categoryRouter from './routes/CategoryRouter.js';
import productRouter from './routes/ProductRoutes.js'; 
import serviceRouter from './routes/ServiceRouter.js'; 
import contactRouter from './routes/contactRoutes.js'; 
import authRouter from './routes/authRoutes.js';

import aboutRouter from './routes/aboutRoutes.js';
import advantageRouter from './routes/advantageRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import resourceRouter from './routes/researchRoutes.js';
import healthbenfirtsRouter from './routes/healthBenefits.js';
import galleryRouter from './routes/GalleryRoutes.js';
import userauthRouter from './routes/userauth.js';
import orderRouter from './routes/orderRoutes.js'
import upcomingRouter from './routes/upcomingRoutes.js';
import messageRouter from './routes/messageRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
connectDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/banner', bannerRouter);
app.use('/api/industrial',industrialRouter);
app.use('/api/testimonial', testimonialRouter);
app.use('/api/story', storyRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/our-team', ourTeamRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/service', serviceRouter);
app.use('/api/contacts', contactRouter); 
app.use('/api/auth', authRouter);
app.use('/api/about', aboutRouter);
app.use('/api/advantage', advantageRouter);
app.use('/api/production', productionRoutes);
app.use('/api/resource', resourceRouter);
app.use('/api/health' , healthbenfirtsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/userauth', userauthRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upcoming', upcomingRouter);
app.use('/api/message', messageRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});