import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {env } from './config/env';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors({
        origin: env.isProd() ? 'https://savora.yerbolat.com' : ['http://localhost:3000', 'http://localhost:8080'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please try again later.' },
    });
    app.use('/api/', limiter);
    // --- Body parsers ---
    app.use(express.json({limit: '10mb'})); // Prevent enormous request bodies
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));


    // --- Basic routes ---
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the Savora API!' });
    });
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return app;
}