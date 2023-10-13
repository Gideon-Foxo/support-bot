const config = require("../../config/config.js");
const settings = require("../../config/support-settings.js");
const Discord = require('discord.js');
const log = require('dbot-console-logger');

module.exports = {

	name: 'helpdesk',
	description: 'Spawns the help desk for support.',
    default_member_permissions: Number(Discord.PermissionFlagsBits.ManageGuild),
	async execute(i) {

        // Define the color
        let color = config.accent
        if (!color) color = config.embed

        // Defines the select menu
        let selectMenu = {
            type: 3,
            customId: "helpDesk",
            placeholder: settings.support.selectMenuName,
            options: []
        }

        // Add all of the questions
        settings.questions.forEach(q => {selectMenu.options.push({
            label: q.question,
            description: (q.questionDescription && q.questionDescription !== "") ? q.questionDescription : undefined,
            emoji: (q.emote && q.emote !== "") ? q.emote : undefined,
            value: `${selectMenu.options.length}`
        })})

        // Add the support option assuming
        if (!settings.support.disableSupport) {
            selectMenu.options.push({ 
                label: settings.support.supportOption.name,
                description: (settings.support.supportOption.description && settings.support.supportOption.description !== "") ? settings.support.supportOption.description : undefined,
                emoji: (settings.support.supportOption.emote && settings.support.supportOption.emote !== "") ? settings.support.supportOption.emote : undefined,
                value: "support"
            })

        }

        // Creates the help desk embed
        const helpDesk = new Discord.EmbedBuilder()
        .setDescription(settings.embed.description)
        .setColor(color)
        if (settings.embed.title) helpDesk.setTitle(settings.embed.title)
        if (settings.embed.thumbnail) helpDesk.setThumbnail(settings.embed.thumbnail)
        if (settings.embed.image) helpDesk.setImage(settings.embed.image)
        if (settings.embed.footer) helpDesk.setFooter({ text: settings.embed.footer })


        // Do some checks and return errors if the checks fail
        if (selectMenu.options.length > 25) {

            const embed = new Discord.EmbedBuilder()
            .setColor(config.color)
            .setDescription("You are trying to send a select menu with more then 25 options. This is not possible, please update your config!")
            return await i.reply({embeds: [embed], ephemeral: true})

        } else if (selectMenu.options.length === 0) {

            const embed = new Discord.EmbedBuilder()
            .setColor(config.color)
            .setDescription("You are trying to send a select menu with no options. This is not possible, please update your config!")
            return await i.reply({embeds: [embed], ephemeral: true})
        }


        // Try to send the help desk!
        try {

            await i.channel.send({embeds: [helpDesk], components: [{type: 1, components: [selectMenu]}]})
            return i.reply({ephemeral: true, content: "Help desk message sent successfully!"})
        // If any errors catch it and return an error message
        } catch (err) {

            log.err("Error in sending help desk", err)

            const embed = new Discord.EmbedBuilder()
            .setColor(config.red)
            .setDescription("An error occurred, please make sure your config is setup correctly! Check your console for more information")
            return await i.reply({embeds: [embed], ephemeral: true})
        }


	},
};