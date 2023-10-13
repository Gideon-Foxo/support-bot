const Discord = require('discord.js');
const log = require('dbot-console-logger');
const config = require('../config/config.js');
const settings = require("../config/support-settings.js");
const logging = require("./logging.js");


async function handler (i) {

    // Define the ID
    let ID = i.customId?.split(" ")
    const client = i.client


    // When support is called. This is because support can be called from more then one function
    async function support() {


        // If support is disabled send a warning message
        if (settings.support.disableSupport) {

            const embed = new Discord.EmbedBuilder()
            .setColor(config.red)
            .setDescription("Support was disabled! Please let an administrator know the help desk is outdated!")
            await i.reply({embeds: [embed], ephemeral: true})
            return log.warn("A user requested support but support is disabled! Please make sure your help desk message is updated!")
        }

        // If support requests a role
        if (settings.support.supportRole) {

            // Catch any errors
            try { 

                // If member already has the support role
                if (i.member.roles.cache.has(settings.support.supportRole)) {

                    const embed = new Discord.EmbedBuilder()
                    .setColor(config.red)
                    .setDescription("You have already requested more support, you can not request it again until it is resolved!")
                    return await i.reply({embeds: [embed], ephemeral: true})
                }
                
            await i.member.roles.add(settings.support.supportRole)
            } catch (err) {
                log.error("Can not add role to user when support is requested. Make sure you are giving a valid role ID, and that the bot has permissions and is above the role.", err)
            }
        }

        // If support requests a private thread
        if (settings.support.createThread) {

            // Define the thread name
            let name = i.user.globalName
            if (!name) name = i.user.tag
            // Catch any errors
            try {
                const channel = await i.channel.threads.create({name: name, type: Discord.ChannelType.PrivateThread})
                await channel.send({content: `<@${i.user.id}> ${settings.support.supportMessage}`, allowedMentions: {users: [i.user.id]} })
                await i.reply({ephemeral: true, content: `${settings.support.requestMessage} <#${channel.id}>`})
            } catch (err) {
                log.error("I can not make a thread, please make sure I have the correct permissions needed!", err)
            }
        // If not threads
        } else {

            await i.reply({content: settings.support.requestMessage, ephemeral: true})

            if (settings.support.supportChannel) {
                try {
                    const channel = await client.channels.fetch(settings.support.supportChannel)
                    await channel.send(settings.support.supportMessage)
                // If error
                } catch (err) {
                    log.error("Error with sending support message in the support channel!", err)
                }
            }
        }
    }


    // If select menu then help desk. Yes, I know this is somewhat hard coded, but if more features get added down the line to where their will be more then one select menu then this will be updated
    if (i.isStringSelectMenu()) {

        ID = i?.values[0]


        // If support
        if (ID === "support") {
            support()
            logging(i, "support")
        // Otherwise if a question
        } else {

            let color = config.accent
            if (!color) color = config.embed

            const button = [{ style: Discord.ButtonStyle.Primary, label: 'I need more support', type: 2, customId: `${ID}` }]

            const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription(settings.questions[ID].answer)
            if (settings.questions[ID].image) embed.setImage(settings.questions[ID].image)

            if (settings.questions[ID].directSupport) await i.reply({embeds: [embed], components: [{type: 1, components: button}], ephemeral: true})
            else await i.reply({embeds: [embed], ephemeral: true})
            
            logging(i, "question")
        }




    // If button (extra support)
    } else if (i.isButton()) {
        support()
        logging(i, "support")
    }
}



module.exports = handler