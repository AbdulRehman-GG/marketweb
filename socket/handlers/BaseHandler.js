class BaseHandler {
    constructor(io, connections) {
        this.io = io;
        this.connections = connections;
    }

    broadcast(event, data) {
        this.io.emit(event, data);
    }

    sendTo(socketId, event, data) {
        const socket = this.connections.get(socketId);
        if (socket) {
            socket.emit(event, data);
        } else {
            console.warn(`Socket ${socketId} not found`);
        }
    }
}

export default BaseHandler;