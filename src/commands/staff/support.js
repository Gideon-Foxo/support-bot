module.exports = {

	name: 'support',
    args: true,
    showArgs: "@User/ID",
	description: 'I am the only real command',
	async execute(msg, args, stuff) {

        // If run in DMs
        if (!msg.guild) return msg.channel.send("Use me in a server silly");

        // this is for checking a users perms.
        let thing = false;
        if (stuff.settings.staffPerm) thing = await msg.guild.member(msg.author).permissionsIn(msg.channel).has(stuff.settings.staffPerm)

        let otherThing = false;
        if (stuff.settings.staffRoleID) otherThing = msg.member.roles.cache.has(stuff.settings.staffRoleID)


       // If you do not have perms to run this command
       if ( !thing && !otherThing ) return msg.channel.send("You need to be staff to run this command!")

       // If the args do not match
       if (!(args[0].match(/<@!?[0-9]+>/) || args[0].match(/^[0-9]+$/))) return msg.channel.send("That does not seem to be a valid user mention or ID!")

       // If a mention strip away the <@!> to leave just a user ID
       const clean = args[0].replace(/<@!?/, "").replace(/>/, "")
       const member = await msg.guild.members.fetch(clean)
       if (!member) return msg.channel.send("I could not resolve that to a user!")

       if (member.roles.cache.has(stuff.settings.supportRoleID)) {
           await member.roles.remove(stuff.settings.supportRoleID)
           await msg.react("✅")
       } else {
        await member.roles.add(stuff.settings.supportRoleID)
        await msg.react("✅")
       }
	
	},
};