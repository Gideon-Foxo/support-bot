module.exports = {

	name: 'ping',
	description: 'Ping!',
	execute(msg, args, stuff) {

		// Pong!
		msg.channel.send('Loading...').then(sentMessage => sentMessage.edit(`Pong! 🏓 Version **${stuff.pack.version}**\nPing: **${Math.round(msg.client.ws.ping)}**ms | API: **${sentMessage.createdTimestamp - msg.createdTimestamp}**ms`));
	
	},
};