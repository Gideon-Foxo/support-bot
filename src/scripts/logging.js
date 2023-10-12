const Discord = require('discord.js');
const log = require('dbot-console-logger');
const config = require('../config/config.js');
const settings = require("../config/support-settings.js");


// Logging function for the help desk
async function logger (i, action, data) {

  if (!settings.support.loggingChannel) return

  try {
    
    const client = i.client
    const channel = await client.channels.fetch(settings.support.loggingChannel)
    let name = i.user.globalName
    if (!name) name = i.user.tag


    if (action === "support") {

      const embed = new Discord.EmbedBuilder()
      .setColor(config.orange)
      .setAuthor({ name: `${name} (${i.user.id})`, iconURL: i.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }), url: `https://discord.com/users/${i.user.id}`})
      .setDescription(`**Extra support requested**${(i.isButton()) ? ` from question \`${settings.questions[i.customId].question}\`` : ""}.`)

      if (settings.support.notificationRole) return await channel.send({embeds: [embed], content: `<@&${settings.support.notificationRole}>`, allowedMentions: {roles: [settings.support.notificationRole]} })
      else return await channel.send({embeds: [embed]})

    // If command to remove support
    } else if (action === "endSupport") {

      const embed = new Discord.EmbedBuilder()
      .setColor(config.green)
      .setAuthor({ name: `${name} (${i.user.id})`, iconURL: i.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }), url: `https://discord.com/users/${i.user.id}`})
      .setDescription(`Support was ended for **${data}**.`)

      return await channel.send({embeds: [embed]})

    // If a question
    } else {

      const embed = new Discord.EmbedBuilder()
      .setColor(config.embed)
      .setAuthor({ name: `${name} (${i.user.id})`, iconURL: i.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }), url: `https://discord.com/users/${i.user.id}`})
      .setDescription(`**Asked**: ${settings.questions[i.values[0]].question}`)

      return await channel.send({embeds: [embed]})
    }
  } catch (err) {
    log.error("Something broke in the logging system, please make sure you have a correct channel ID, and that I have perms to send messages in that channel", err)

  }
}


module.exports = logger