export class ChatService {
	constructor(fastify, chatRepository, friendService) {
		this.fastify = fastify;
		this.chatRepository = chatRepository;
		this.friendService = friendService;
	}

	async #sendNotification({ event, sender, receiver, date }) {
		const notification = {
			service: 'chat',
			event,
			sender,
			receiver,
			date,
		};
		await this.fastify.publishInNotifQueue(notification);
	}

	async isFriend(from, to) {
		let response = await this.friendService.isFriend(from, to);
		return response;
	}

	async processInnerMessage(outerCnx, innerCnx, from, message) {
		// inner
		const InnerSocketFrom = innerCnx.get(from);
		const InnerSocketTo = innerCnx.get(InnerSocketFrom.friend);
		
		// outer
		const OuterSocketFrom = outerCnx.get(from);
		const OuterSocketTo = outerCnx.get(InnerSocketFrom.friend);

		const delivredMessage = {
			event: 'CHATMESSAGE',
			sender: from,
			receiver: InnerSocketFrom?.friend,
			message: message,
			date: Date.now(),
		};
	
		this.chatRepository.insertMessage(delivredMessage);


		if (OuterSocketFrom) this.deliverOuterMessages(OuterSocketFrom);
		if (OuterSocketTo) this.deliverOuterMessages(OuterSocketTo);

		if (InnerSocketFrom) {
			this.deliverInnerMessages(InnerSocketFrom);
		}
		if (InnerSocketTo && InnerSocketTo.friend === from) {
			this.deliverInnerMessages(InnerSocketTo);
			this.chatRepository.update(InnerSocketTo.connected, InnerSocketTo.friend);
		} else await this.#sendNotification(delivredMessage);
	}

	async deliverOuterMessages(socket) {
		let messages = this.chatRepository.findGroupMessages(socket.connected);

		const friendChecks = await Promise.all(messages.map((m) => this.isFriend(m?.friend, socket.connected)));
		let friendMessages = messages.filter((_, i) => friendChecks[i]);

		const enriched = await Promise.all(
			friendMessages.map(async (msg) => {
				const user = await this.friendService.getUserByUsername(msg?.friend);
				msg.avatar = user?.avatar_url;
				msg.lastMessage = this.chatRepository.findLastMessage(msg?.friend, socket.connected);
				this.chatRepository.update(msg?.friend, socket.connected);
				return msg;
			})
		);

		socket.send(JSON.stringify(enriched));
	}

	async deliverInnerMessages(socket) {
		const messages = this.chatRepository.findAll(socket.connected, socket.friend);
		if (messages.length) socket.send(JSON.stringify(messages));
	}
}
