const config = require("../../config/config.js");
const Discord = require('discord.js');

module.exports = {

	name: 'about',
	description: 'Returns information about this bot',
	async execute(i) {

        // Define the color
        let color = config.accent
        if (!color) color = config.embed


        const embed = new Discord.EmbedBuilder()
        .setTitle("About Support Bot")
        .setThumbnail(i.client.user.avatarURL({ format: 'png', dynamic: true, size: 2048 }))
        .setDescription(`Support Bot is a self hosted, simple and lightweight support desk designed to help automate support. Made by **Gideon_foxo** using [Discord.js](https://discord.js.org/#/) with a MIT license.\n\n[Github](https://github.com/Gideon-Foxo/support-bot) | [Support Server](https://discord.gg/s4BX2qu6Hu) | [Donate](https://foxo.gay/donate)`)
        .setColor(color)

        return await i.reply({embeds: [embed]})
	},
};