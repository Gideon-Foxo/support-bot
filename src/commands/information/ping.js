const config = require("../../config/config.js");
const Discord = require('discord.js');
const package = require('../.././package.json');
const snip = require("../../scripts/snippets");

module.exports = {

	name: 'ping',
	description: 'Returns my current latency, uptime and version!',
	async execute(i) {


		// Defines the message (this is so we can easily edit it)
		let message = null;

		// The first embed that is sent
		const firstEmbed = new Discord.EmbedBuilder()
		.setColor(config.embed)
		.setDescription("Ping?")

		// Changes how it responds based on if the bot in text or slash mode
		message = await i.reply({ embeds: [firstEmbed] })

        // For the embed color
        const time = message.createdTimestamp -i.createdTimestamp 

        // Define the color!
        let color = config.green
        if (time > 1200) color = config.red 
        else if(time > 600) color = config.orange 

		// Defines the embed that the message is edited to
		const finishEmbed = new Discord.EmbedBuilder()
		.setColor(color)
        .setTitle("Pong! 🏓")
		.setDescription(`**Version**: **${package.version}**\n**Latency**: **${Math.round(time)}**ms\n**Gateway**: **${Math.round(i.client.ws.ping)}**ms\n**Uptime**: ${snip.uptime()}`)

		// Edits the original message
		return await message.edit({embeds: [finishEmbed]})
	},
};