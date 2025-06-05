import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import BaseHandler from './BaseHandler.js';

class ConnectionHandler extends BaseHandler {
    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) throw new Error('No authentication token provided');
            
            let decoded;
            
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                socket.disconnect(true);
                throw new Error('Invalid authentication token');
            }
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                socket.disconnect(true);
                throw new Error('User not found');
            }

            const sessionExists = user.sessions.some(session => session.token === token);
            if (!sessionExists) {
                socket.emit('force_logout', { message: 'Session expired or invalid' });
                socket.disconnect(true);
            }
            
            socket.user = await user.getPublicProfile();
            this.connections.set(socket.user.id, socket);

            socket.emit('connection_success', { user: user.getPublicProfile() });
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    handleDisconnection(socket) {
        socket.on('disconnect', () => {
            this.connections.delete(socket.user);
        });
    }
}

export default ConnectionHandler;