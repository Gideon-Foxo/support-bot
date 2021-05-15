module.exports = {

	name: 'ping',
	description: 'Ping!',
	execute(msg, args) {

		// Pong!
		msg.channel.send('Loading...').then(sentMessage => sentMessage.edit(`Pong! 🏓\nPing: **${Math.round(msg.client.ws.ping)}**ms | API: **${sentMessage.createdTimestamp - msg.createdTimestamp}**ms`));
	
	},
};