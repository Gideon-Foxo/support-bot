const config = require("../../config/config.js");
const settings = require("../../config/support-settings.js");
const Discord = require('discord.js');
const logging = require("../../scripts/logging.js");
const log = require('dbot-console-logger');

module.exports = {

	name: 'endsupport',
	description: 'Ends support for a user by removing their support role.',
    options: [{type: 6, name: "user", description: "Select a user to end support with!", required: true}],
    default_member_permissions: Number(Discord.PermissionFlagsBits.ManageMessages),
	async execute(i) {


        const user = i.options.data[0].user.id
        const member = await i.guild.members.fetch(user)

        // If no member
        if (!member) {

            const embed = new Discord.EmbedBuilder()
            .setColor(config.red)
            .setDescription("This user is not in the server, they must be in the server for the user to have roles!")
            return await i.reply({ephemeral: true, embeds: [embed]})
        }

        // If member does not have the support role
        if (!member.roles.cache.has(settings.support.supportRole)) {

            const embed = new Discord.EmbedBuilder()
            .setColor(config.red)
            .setDescription("This user does not have the support role!")
            return await i.reply({ephemeral: true, embeds: [embed]})
        }

        // Try to remove the role
        try {

            await member.roles.remove(settings.support.supportRole)
            await i.reply({content: "Support has been removed!", ephemeral: true})
            logging(i, "endSupport", member.displayName)

        } catch (err) {

            log.err("error in end support", err)

            const embed = new Discord.EmbedBuilder()
            .setColor(config.red)
            .setDescription("I could not remove the role from the user. Please make sure I have the correct permissions to do so or check the console for more information.")
            return await i.reply({ephemeral: true, embeds: [embed]})
        }
	},
};