// NODE_MODULES
import EventEmitter from 'events';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';

// FILES
import ConnectDatabase from './modules/Database.js'
import SocketServer from './socket/index.js'  // Updated import path
EventEmitter.defaultMaxListeners = 20; // Increase the limit
dotenv.config();


const app = express();
const server = http.createServer(app);

ConnectDatabase();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Debug middleware (add this)
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to: ${req.originalUrl}`);
  next();
});

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const socketServer = new SocketServer(io);

// Routes
import AuthRoute from './router/authRouter.js';
app.use('/api/auth', AuthRoute);

import GigRoute from './router/gigRouter.js';
app.use('/api/gig', GigRoute);

import WalletRoute from './router/walletRouter.js';
app.use('/api/wallet', WalletRoute);

import OrderRoute from './router/orderRouter.js';
app.use('/api/orders', OrderRoute);

server.listen(process.env.PORT, () => {
    console.log("Backend Server started at http://localhost:" + process.env.PORT);
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
});

// const app = express();
// const server = http.createServer(app);

// ConnectDatabase()

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:3001',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true
// }));

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3001',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });
// // Initialize socket server
// const socketServer = new SocketServer(io);

// import AuthRoute from './router/authRouter.js'
// app.use('/api/auth', AuthRoute);

// import GigRoute from './router/gigRouter.js'
// app.use('/api/gig', GigRoute);

// import PaymentRoute from './router/gigRouter.js'
// app.use('/api/gig', GigRoute);


// server.listen(process.env.PORT, () => {
//     console.log("Backend Server started at http://localhost:" + process.env.PORT);
// });

// process.on('SIGINT', async () => {
//     console.log('Shutting down server...');
//     process.exit(0);
// });