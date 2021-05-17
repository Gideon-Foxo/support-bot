// This allows pm2 and chalk to work at the same time. Without it when using pm2 chalk does not do anything.
process.env.FORCE_COLOR = "true";
// Define modules
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const chalk = require('chalk');
const { promisify } = require('util')


// Define our files 
const config = require('./config/config.js');
const settings = require('./config/settings.js');
const token = require('./config/token.json');



const client = new Discord.Client();
client.commands = new Discord.Collection();


// This is used later for timing the deletion of messages
const wait = promisify(setTimeout) 


// Command loading! 
// Add all new folders here 
client.cmdmodules = fs.readdirSync(path.join(__dirname, './commands/'))

// Loops thought the folders under 'commands' and loads the command files as long as they are js files
for (const folder of client.cmdmodules) {  
    let filesInFolder = fs.readdirSync(path.join(__dirname, './commands/', folder)).filter(file => file.endsWith('.js'))
    for (const file of filesInFolder) {
        const commandexport = require(`./commands/${folder}/${file}`)
        commandexport.module = folder
        client.commands.set(commandexport.name, commandexport)
        config.log.debug(`Loaded command ${chalk.bold(commandexport.name)}`)
    }
}



// This event triggers when the bot is ready
client.on('ready', async () => {

    // This sets the bots status if enabled
    if (settings.status.enabled) await client.user.setPresence({ activity: { name: settings.status.name, type: settings.status.type }, status: settings.status.visibility }).catch(err => config.log.error(err))
    config.log.info(`Support bot is now ${chalk.bold.green("online")}.`)
})



// The message event where almost all of the goodies happen
client.on('message', async msg => {


    // Defines args
    let args = msg.content.trim().split(/ +/);

    // defines if the channel is a support channel or not
    let supportChannel = false;
    if (msg.guild && (msg.channel.id === settings.supportChannelID)) supportChannel = true;

    // Defines number, this is used if a user trying to get support
    let number = Number(args[0])

    // Now that we have defined number we can go ahead and replace args to assume there is a prefix
    args = msg.content.slice(settings.prefix.length).trim().split(/ +/);


    // This defines clint perms, the perms the clint has in the given channel
    let clientPerms = await msg.guild?.member(client.user).permissionsIn(msg.channel);
    let embedPerms = true;
    if (!clientPerms.has("EMBED_LINKS")) embedPerms = false


    // If message does not start with the prefix or its sent by a bot run the support func and return.
	if (!msg.content.startsWith(settings.prefix) || msg.author.bot) return await runSupport();

    // Defines command if it exists
	const command = args.shift().toLowerCase();


    // If command doesn't exist run support func and return.
	if (!client.commands.has(command)) return await runSupport();


    // If bot lacks send message perms return and console log a warning
    if (!clientPerms.has("SEND_MESSAGES")) return config.log.warning(`I do not have permissions to send messages in channel ${msg.channel.name}.`)


    // If command is run in the support channel
    if (supportChannel) {
        if (clientPerms.has("MANAGE_MESSAGES")) await msg.delete()
    }


    // If the command needs args and none are provided
    if (command.args && args.length) return await msg.channel.send(`This command requires the arguments **${command.args}** in order to be ran!`)


    // This is an object that we pass a bunch of data into the command
    const stuff = {
        client: client,
        supportChannel: supportChannel,
        embedPerms: embedPerms,
        config: config,
        settings: settings,
    }



    // This runs the command
	try {
		client.commands.get(command).execute(msg, args, stuff);
        // If any error try to catch it
	} catch (err) {
		config.log.error(require("util").inspect(err))
		await msg.channel.send("⚠️ An error occurred when trying to execute this command!")
	}



    // Sets the function that does the responding if support. This is made this way so if you run a command in a support channel it doesn't respond with an error.
    async function runSupport () {

        // If command is not sent in the support channel return
        if (!supportChannel) return;

        // If message is sent by a bot remove it in 10 seconds. Feel free to either change this time or remove it downright. DO NOT REMOVE THIS RETURN. The bot will respond to itself getting it ratelimited.
        if (msg.author.bot) {

            // If it is itself
            if (msg.author.id === client.user.id) return;
            await wait(10 * 1000)
        }

        // If bot doesnt have perms to send messages return and log a warning
        if (!clientPerms.has("SEND_MESSAGES")) return config.log.warning(`I do not have permissions to send messages in channel ${msg.channel.name}.`)
        if (clientPerms.has("MANAGE_MESSAGES")) await msg.delete()
        else config.log.warning(`I am lacking permissions to delete messages in ${msg.channel.name}.`)

        // For defining the local message
        let message = null;


        // If message is not a number return an error
        if (isNaN(number)) message = await msg.channel.send(`<@${msg.author.id}> ` +  settings.invalidNumber)


        // If they send the request help number
        else if (settings.responses[number] === "SUPPORT") {

            // If bot doesnt have mange role perms
            if (!clientPerms.has("MANAGE_ROLES")) return config.log.warning(`I do not have permissions to manage roles for the support system!`)


            // If user has support role remove it
            if (msg.member.roles.cache.has(settings.supportRoleID)) return await msg.member.roles.remove(settings.supportRoleID)

            // If user is requesting support and does not have the support role
            else {

                // Add the role to the user
                await msg.member.roles.add(settings.supportRoleID)


                // If message of support is enabled
                if (settings.supportResponses.enabled) {

                    // Defines the channel and logs a warning if the channel doesnt exist
                    const channel = await msg.guild.channels.resolve(settings.supportResponses.channelID)

                    // If channel send message and if a timeout for delete then delete it after time
                    if (channel) {

                        const message = await channel.send(`<@${msg.author.id}> ` + settings.supportResponses.message)

                        // If this message is to delete after x amount of time then delete it
                        if (settings.supportResponses.deleteTime && settings.supportResponses.deleteTime != 0) {
                            await wait(settings.supportResponses.deleteTime * 1000)
                            await message.delete()
                        }
                    } else config.log.warning(`supportResponses.channelID is not a valid channel ID!`)
                }
            } 

        } else if (settings.responses[number]) message = await msg.channel.send(settings.responses[number])
        // If a number but no message for said number
        else message = message = await msg.channel.send(`<@${msg.author.id}> ` + settings.invalidNumber)



        // This is how to wait before deleting the message.
        await wait(settings.deleteTime * 1000)
        if (message) await message.delete()


    }

});


// This is how we log into Discord
client.login(token.token)