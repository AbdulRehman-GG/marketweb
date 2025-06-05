import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ConnectionHandler from './handlers/ConnectionHandler.js';
import MessageHandler from './handlers/MessageHandler.js';

class SocketServer {
    constructor(io) {
        this.io = io;
        this.connections = new Map();
        this.connectionHandler = new ConnectionHandler(io, this.connections);
        this.messageHandler = new MessageHandler(io, this.connections);
        this.initialize();
    }

    initialize() {
        this.io.on('connection', async (socket) => {
            try {
                await this.connectionHandler.handleConnection(socket);
                this.connectionHandler.handleDisconnection(socket);
                this.messageHandler.handleEvents(socket);
            } catch (error) {
                console.error('Connection error:', error);
                socket.disconnect(true);
            }
        });
    }
}

export default SocketServer;
