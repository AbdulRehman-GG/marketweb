import BaseHandler from './BaseHandler.js';

class MessageHandler extends BaseHandler {
    handleEvents(socket) {
        socket.on('message', (data) => {
            console.log(`Received message from ${socket.id}:`, data);
            socket.emit('message_received', { status: 'success', messageId: data.id });
        });
    }
}

export default MessageHandler;