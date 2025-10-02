export class ChatController {
    constructor(fastify, chatService, friendService) {
        this.outerConnections = new Map();
        this.innerConnections = new Map();
        this.fastify = fastify;
        this.chatService = chatService;
        this.friendService = friendService;
    }

    async manageOuterConnection(socket, request) {
        const connectedUser = request.headers['x-auth-user'];
        if (!connectedUser || this.outerConnections.has(connectedUser)) {
            socket.close();
            return;
        }
        socket.connected = connectedUser;
        this.outerConnections.set(connectedUser, socket);
        this.chatService?.deliverOuterMessages(socket);

        socket.on('message', (msg) => {
            try {
                msg = msg.toString();
                const content = JSON.parse(msg);
                this.#processOuterMessage(socket, content);
            } catch (err) {
                console.error('Invalid message received:', msg, err);
                socket.send(JSON.stringify({ error: 'Invalid message format' }));
            }
        });

        socket.on('close', () => this.outerConnections.delete(connectedUser));
        socket.on('error', (err) => console.log(err));
    }

    async manageInnerConnection(socket, request) {
        const connectedUser = request.headers['x-auth-user'];
        const friend = request.params?.friend;
        const isFriend = connectedUser && friend && (await this.friendService.isFriend(connectedUser, friend));
        if (this.innerConnections.has(connectedUser) || !isFriend) {
            socket.close();
            return;
        }

        socket.connected = connectedUser;
        socket.friend = friend;
        this.innerConnections.set(connectedUser, socket);
        this.chatService?.deliverInnerMessages(socket);

        socket.on('message', (msg) => {
            try {
                msg = msg.toString();
                const content = JSON.parse(msg);
                this.#processInnerMessage(connectedUser, socket.friend, content);
            } catch (err) {
                console.error('Invalid message received:', msg, err);
                socket.send(JSON.stringify({ error: 'Invalid message format' }));
            }
        });

        socket.on('close', () => this.innerConnections.delete(connectedUser));
        socket.on('error', (err) => console.log(err));
    }

    #processOuterMessage(socket, content) {
        const keys = Object.keys(content);
        if (keys.length !== 1 || keys[0] !== 'message') return;
        this.chatService.deliverOuterMessages(socket);
    }

    async #processInnerMessage(connectedUser, friend, content) {
        if (!(await this.friendService.isFriend(connectedUser, friend)))
            return;
        const keys = Object.keys(content);
        if (keys.length !== 1 || keys[0] !== 'message') return;
        this.chatService.processInnerMessage(this.outerConnections, this.innerConnections, connectedUser, content.message);
    }
}
