// This allows pm2 and chalk to work at the same time. Without it when using pm2 chalk does not do anything.
process.env.FORCE_COLOR = "true";

// Define modules
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const log = require('dbot-console-logger');

// Require fillesssss
const interactions = require("./scripts/interactions")
const token = require('./config/token.json');
const package = require('./package.json');
const config = require("./config/config");
const settings =  require("./config/support-settings");



// Defines the client or bot instance
const client = new Discord.Client({
    allowedMentions: { parse: [] },
    intents: [Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.Guilds]
});
client.commands = new Discord.Collection();

// Define client uptime 
client.startTime = Date.now()



// This triggers when the bot is "ready"
client.on('ready', async (client) => {


    // Command loading! 
    // Add all new folders here 
    client.cmdmodules = fs.readdirSync(path.join(__dirname, './commands/'))

    // Loops thought the folders under 'commands' and loads the command files as long as they are js files
    for (const folder of client.cmdmodules) {  
        let filesInFolder = fs.readdirSync(path.join(__dirname, './commands/', folder)).filter(file => file.endsWith('.js'))
        for (const file of filesInFolder) {
            const commandexport = require(`./commands/${folder}/${file}`)
            commandexport.module = folder
            // If the file starts with _ ignore it
            if (commandexport?.name?.startsWith("_") || !commandexport?.name || file.startsWith("_")) continue
            // If the command is end support and that type of support (if any) does not exist
            if (commandexport?.name === "endsupport" && (settings.support.disableSupport || !settings.support.supportRole)) continue
            client.commands.set(commandexport.name, commandexport)
            //log.debug(`Loaded command ${log.c.bold(commandexport.name)}`)
        }
    }

    
    // Defines all of the commands in one array
    let slashCommands = [...client.commands.values()].map(c => ({ ...c }))


    try {
        // Defines the where to send the commands to
        const rest = new Discord.REST().setToken(token.token);

        // Tell Discord our commands
        await rest.put(
            Discord.Routes.applicationCommands(client.user.id),
            { body: slashCommands },
        );
    // Catch any errors if Discord is unhappy
    } catch (error) {
        log.err("Error attempting to send slash data", error)
    }

    await client.presence.set({ activities: [{ name: config.status, type: Discord.ActivityType.Custom }], status: config.presence })
    // When everything is fully done send the the console log that I am ready!
    log.info(`I am now ${log.chalk.green("ready")} logged into ${log.chalk.bold(client.user.tag)} running version ${log.chalk.bold(package.version)} in ${log.chalk.bold(client.guilds.cache.size)} servers`)
})



// The interaction event! 
client.on('interactionCreate', async i => { 


    // If slash command
    if (i.isCommand()) {
        let command = null
        try {

            // Fetch the command
            command = client.commands.get(i.commandName)
        
            await command.execute(i);

        // Catch the errors! This is a really basic system I plan to make it much nicer later 
        } catch (err) {

            log.err(`Error in command ${command?.name}`, err)

            const embed = new Discord.EmbedBuilder()
            .setColor(config.orange)
            .setDescription("⚠️ An unexpected error occurred, please try again. If the issue persists please let an administrator know!")
            return await i.reply({embeds: [embed], ephemeral: true})
        }
    // If an interaction thats not a slash command!
    } else {
        try {

            await interactions(i)

        // Catch any errors that might happen
        } catch (err) {
            log.err("Error in the interaction handler!", err)

            const embed = new Discord.EmbedBuilder()
            .setColor(config.orange)
            .setDescription("⚠️ An unexpected error occurred, please try again. If the issue persists please let an administrator know!")
            return await i.reply({embeds: [embed], ephemeral: true})
        }
    }
})



// Log in! Log in! Log in! Log in! Log in! Log in! 
client.login(token.token)


// Allows the client to be accessed as a module
module.exports = client